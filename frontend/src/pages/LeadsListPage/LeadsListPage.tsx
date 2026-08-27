import {
  ChevronLeft,
  ChevronRight,
  Eye,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';
import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../../components/common';
import { APP_ROUTES, PAGINATION_LIMIT } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useDebounce } from '../../hooks';
import type { LeadWithNotesCount, PaginationMeta } from '../../types/lead';
import { formatDate } from '../../utils';
import './LeadsListPage.css';

export const LeadsListPage: React.FC = () => {
  const { adminEmail, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const querySearch = searchParams.get('search') || '';
  const queryPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(querySearch);
  const debouncedSearch = useDebounce(searchInput, 350);

  const [leads, setLeads] = useState<LeadWithNotesCount[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: queryPage,
    limit: PAGINATION_LIMIT,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [_, startTransition] = useTransition();

  useEffect(() => {
    const currentSearchParam = searchParams.get('search') || '';
    const trimmed = debouncedSearch.trim();

    if (trimmed !== currentSearchParam) {
      startTransition(() => {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (trimmed) {
            next.set('search', trimmed);
          } else {
            next.delete('search');
          }
          next.delete('page');
          return next;
        });
      });
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  const fetchLeads = useCallback(
    async (page = queryPage, search = querySearch) => {
      setIsLoading(true);
      try {
        const response = await api.getLeads({
          search: search || undefined,
          page,
          limit: PAGINATION_LIMIT,
        });

        if (response.success) {
          setLeads(response.data);
          setPagination(response.pagination);
          setError(null);
        }
      } catch (err: unknown) {
        setError((err as Error).message || 'Failed to fetch leads');
      } finally {
        setIsLoading(false);
      }
    },
    [queryPage, querySearch]
  );

  useEffect(() => {
    fetchLeads(queryPage, querySearch);
  }, [fetchLeads, querySearch, queryPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === queryPage) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage > 1) {
        next.set('page', String(newPage));
      } else {
        next.delete('page');
      }
      return next;
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await api.deleteLead(deleteTarget.id);
      setDeleteTarget(null);

      if (leads.length === 1 && queryPage > 1) {
        handlePageChange(queryPage - 1);
      } else {
        await fetchLeads(queryPage, querySearch);
      }
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to delete lead');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="leads-header">
        <div>
          <h1 className="leads-title">Leads</h1>
        </div>

        <div className="leads-header-actions">
          {adminEmail && (
            <div className="user-profile-badge">
              <User size={14} className="user-icon" />
              <span className="user-email">{adminEmail}</span>
              <Button
                variant="secondary"
                onClick={logout}
                className="logout-btn"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={14} />
                Logout
              </Button>
            </div>
          )}

          <Link to={APP_ROUTES.CREATE_LEAD} aria-label="Add new lead">
            <Button variant="primary" aria-label="Add new lead">
              <Plus size={16} />
              Add Lead
            </Button>
          </Link>
        </div>
      </div>

      <div className="leads-filter-bar">
        <div className="search-box">
          <Search size={16} className="search-icon-svg" />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by name, email, phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search leads by name, email, or phone"
          />
          {searchInput && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchInput('')}
              aria-label="Clear search input"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="leads-error-banner" role="alert">
          {error}
        </div>
      )}

      {isLoading && leads.length === 0 ? (
        <div className="empty-state">
          <div className="loading-spinner empty-state-spinner" />
          <p>Loading leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-title">No leads found</h3>
          <p className="empty-desc">
            {querySearch
              ? 'No leads match your search criteria.'
              : 'Create your first lead to get started.'}
          </p>
          <Link to={APP_ROUTES.CREATE_LEAD} aria-label="Create your first lead">
            <Button variant="primary" aria-label="Create your first lead">
              <Plus size={16} />
              Add Lead
            </Button>
          </Link>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Lead</TableHeaderCell>
              <TableHeaderCell>Contact</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell alignRight>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Link
                    to={APP_ROUTES.LEAD_DETAIL(lead.id)}
                    className="lead-name-link"
                    aria-label={`View details for lead ${lead.name}`}
                  >
                    {lead.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <div>{lead.email}</div>
                  <div className="lead-meta">{lead.phone || '—'}</div>
                </TableCell>
                <TableCell>
                  <span className="lead-status-text">{lead.status}</span>
                </TableCell>
                <TableCell>
                  <span className="lead-meta">{formatDate(lead.createdAt)}</span>
                </TableCell>
                <TableCell alignRight>
                  <div className="actions-group">
                    <Link
                      to={APP_ROUTES.LEAD_DETAIL(lead.id)}
                      aria-label={`View details for ${lead.name}`}
                    >
                      <Button
                        variant="icon"
                        aria-label={`View details for ${lead.name}`}
                        title="View details"
                      >
                        <Eye size={15} />
                      </Button>
                    </Link>
                    <Link
                      to={`${APP_ROUTES.LEAD_DETAIL(lead.id)}?edit=true`}
                      aria-label={`Edit lead ${lead.name}`}
                    >
                      <Button
                        variant="icon"
                        aria-label={`Edit lead ${lead.name}`}
                        title="Edit lead"
                      >
                        <Pencil size={15} />
                      </Button>
                    </Link>
                    <Button
                      variant="icon"
                      onClick={() => setDeleteTarget({ id: lead.id, name: lead.name })}
                      aria-label={`Delete lead ${lead.name}`}
                      title="Delete lead"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {pagination.totalPages > 1 && (
        <nav className="pagination-container" aria-label="Pagination Navigation">
          <div className="pagination-buttons">
            <button
              type="button"
              className="page-number-btn"
              disabled={queryPage <= 1}
              onClick={() => handlePageChange(queryPage - 1)}
              aria-label="Go to previous page"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                type="button"
                key={p}
                className={`page-number-btn ${queryPage === p ? 'active' : ''}`}
                onClick={() => handlePageChange(p)}
                aria-label={`Go to page ${p}`}
                aria-current={queryPage === p ? 'page' : undefined}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              className="page-number-btn"
              disabled={queryPage >= pagination.totalPages}
              onClick={() => handlePageChange(queryPage + 1)}
              aria-label="Go to next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </nav>
      )}

      <Modal
        isOpen={Boolean(deleteTarget)}
        title="Delete Lead"
        message={`Are you sure you want to delete lead "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default LeadsListPage;
