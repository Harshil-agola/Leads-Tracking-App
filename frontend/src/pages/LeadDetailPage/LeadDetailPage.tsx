import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';
import { Button, Modal } from '../../components/common';
import { APP_ROUTES, MAX_NOTE_LENGTH } from '../../constants';
import type { LeadWithNotes } from '../../types/lead';
import { formatDate } from '../../utils';
import { EditLeadForm } from './EditLeadForm';
import { LeadInfoGrid } from './LeadInfoGrid';
import './LeadDetailPage.css';

interface AddNoteFormInputs {
  content: string;
}

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState<LeadWithNotes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEditing = searchParams.get('edit') === 'true';
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  const [isSavingNoteEdit, setIsSavingNoteEdit] = useState(false);

  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);
  const [isDeletingNote, setIsDeletingNote] = useState(false);

  const {
    register: registerNote,
    handleSubmit: handleSubmitNote,
    reset: resetNote,
    control: controlNote,
    formState: { errors: errorsNote, isSubmitting: isSubmittingNote },
  } = useForm<AddNoteFormInputs>({
    defaultValues: {
      content: '',
    },
  });

  const noteContent = useWatch({ control: controlNote, name: 'content', defaultValue: '' }) || '';

  useEffect(() => {
    if (!id) return;

    const fetchLead = async () => {
      try {
        const data = await api.getLeadById(id);
        setLead(data);
        setError(null);
      } catch (err: unknown) {
        setError((err as Error).message || 'Lead not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleStartEditing = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('edit', 'true');
      return next;
    });
  };

  const handleCancelEditing = () => {
    if (searchParams.get('edit')) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('edit');
        return next;
      });
    }
  };

  const handleEditSuccess = (updatedLead: LeadWithNotes) => {
    setLead(updatedLead);
    if (searchParams.get('edit')) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('edit');
        return next;
      });
    }
  };

  const onAddNoteSubmit = async (data: AddNoteFormInputs) => {
    if (!id || !data.content.trim()) return;

    try {
      const newNote = await api.addNote(id, data.content.trim());
      setLead((prev) =>
        prev
          ? {
              ...prev,
              notes: [newNote, ...(prev.notes || [])],
            }
          : null
      );
      resetNote({ content: '' });
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to add note');
    }
  };

  const handleStartEditNote = (noteId: number, currentContent: string) => {
    setEditingNoteId(noteId);
    setEditNoteContent(currentContent);
  };

  const handleSaveNoteEdit = async (noteId: number) => {
    if (!id || !editNoteContent.trim()) return;

    setIsSavingNoteEdit(true);
    try {
      const updatedNote = await api.updateNote(id, noteId, editNoteContent.trim());
      setLead((prev) =>
        prev
          ? {
              ...prev,
              notes: (prev.notes || []).map((n) => (n.id === noteId ? updatedNote : n)),
            }
          : null
      );
      setEditingNoteId(null);
      setEditNoteContent('');
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to update note');
    } finally {
      setIsSavingNoteEdit(false);
    }
  };

  const handleConfirmDeleteNote = async () => {
    if (!id || !deletingNoteId) return;

    setIsDeletingNote(true);
    try {
      await api.deleteNote(id, deletingNoteId);
      setLead((prev) =>
        prev
          ? {
              ...prev,
              notes: (prev.notes || []).filter((n) => n.id !== deletingNoteId),
            }
          : null
      );
      setDeletingNoteId(null);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to delete note');
    } finally {
      setIsDeletingNote(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!lead || !id) return;

    setIsDeleting(true);
    try {
      await api.deleteLead(id);
      navigate(APP_ROUTES.HOME);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to delete lead');
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="empty-state">
        <div className="loading-spinner empty-state-spinner" />
        <p>Loading lead details...</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="empty-state" role="alert">
        <h3 className="empty-title">Lead Not Found</h3>
        <p className="empty-desc">{error || 'The requested lead does not exist.'}</p>
        <Link to={APP_ROUTES.HOME} aria-label="Back to leads list" className="not-found-link">
          <Button variant="primary" aria-label="Back to leads list">
            <ArrowLeft size={16} />
            Back to Leads
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="lead-detail-wrapper">
      <div className="lead-detail-back-link-wrapper">
        <Link
          to={APP_ROUTES.HOME}
          className="lead-detail-back-link"
          aria-label="Back to leads list"
        >
          <ArrowLeft size={14} />
          Back to Leads
        </Link>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-header-left">
            <h1 className="detail-title">{isEditing ? 'Edit Lead' : lead.name}</h1>
          </div>

          {!isEditing && (
            <div className="detail-header-actions">
              <Button
                variant="secondary"
                onClick={handleStartEditing}
                aria-label={`Edit lead ${lead.name}`}
              >
                <Pencil size={14} />
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
                aria-label={`Delete lead ${lead.name}`}
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <EditLeadForm lead={lead} onSuccess={handleEditSuccess} onCancel={handleCancelEditing} />
        ) : (
          <LeadInfoGrid lead={lead} />
        )}
      </div>

      <div className="detail-card">
        <h2 className="notes-section-title">Notes</h2>

        <form
          onSubmit={handleSubmitNote(onAddNoteSubmit)}
          noValidate
          className="add-note-form"
          aria-label="Add note to lead"
        >
          <div className="form-group">
            <textarea
              id="note-content-input"
              className="form-textarea"
              rows={3}
              placeholder="Record call notes, customer requirements, next steps..."
              aria-label="Note content"
              {...registerNote('content', {
                required: 'Note content cannot be empty',
                maxLength: {
                  value: MAX_NOTE_LENGTH,
                  message: `Note cannot exceed ${MAX_NOTE_LENGTH} characters`,
                },
              })}
              disabled={isSubmittingNote}
            />
            {errorsNote.content && (
              <span className="form-error" role="alert">
                {errorsNote.content.message}
              </span>
            )}
          </div>
          <div className="note-form-footer">
            <span className="note-char-count">
              {noteContent.length}/{MAX_NOTE_LENGTH} characters
            </span>
            <Button
              type="submit"
              variant="primary"
              disabled={!noteContent.trim() || isSubmittingNote}
              aria-label="Save note"
            >
              <Plus size={15} />
              {isSubmittingNote ? 'Saving...' : 'Add Note'}
            </Button>
          </div>
        </form>

        <section className="notes-container" aria-label="Lead notes timeline">
          {!lead.notes || lead.notes.length === 0 ? (
            <div className="empty-notes-msg">No notes recorded yet for this lead.</div>
          ) : (
            lead.notes.map((note) => (
              <div key={note.id} className="note-item">
                <div className="note-header">
                  <span className="note-date">{formatDate(note.createdAt)}</span>
                  <div className="note-actions">
                    <button
                      type="button"
                      className="note-action-btn"
                      onClick={() => handleStartEditNote(note.id, note.content)}
                      title="Edit note"
                      aria-label="Edit note"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      className="note-action-btn delete-btn"
                      onClick={() => setDeletingNoteId(note.id)}
                      title="Delete note"
                      aria-label="Delete note"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {editingNoteId === note.id ? (
                  <div className="note-edit-box">
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={editNoteContent}
                      onChange={(e) => setEditNoteContent(e.target.value)}
                      disabled={isSavingNoteEdit}
                    />
                    <div className="note-edit-actions">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingNoteId(null);
                          setEditNoteContent('');
                        }}
                        disabled={isSavingNoteEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleSaveNoteEdit(note.id)}
                        disabled={!editNoteContent.trim() || isSavingNoteEdit}
                      >
                        {isSavingNoteEdit ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="note-content">{note.content}</div>
                )}
              </div>
            ))
          )}
        </section>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete Lead"
        message={`Are you sure you want to delete lead "${lead.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <Modal
        isOpen={deletingNoteId !== null}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete Note"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeletingNote}
        onConfirm={handleConfirmDeleteNote}
        onClose={() => setDeletingNoteId(null)}
      />
    </div>
  );
};

export default LeadDetailPage;
