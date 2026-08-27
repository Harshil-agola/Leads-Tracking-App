import type React from 'react';
import './Table.css';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  containerClassName?: string;
}

export const Table: React.FC<TableProps> = ({
  children,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`ui-table-container ${containerClassName}`}>
      <table className={`ui-table ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  ...props
}) => <thead {...props}>{children}</thead>;

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  ...props
}) => <tbody {...props}>{children}</tbody>;

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <tr className={`ui-table-tr ${className}`} {...props}>
    {children}
  </tr>
);

export const TableHeaderCell: React.FC<
  React.ThHTMLAttributes<HTMLTableCellElement> & { alignRight?: boolean }
> = ({ children, alignRight, className = '', ...props }) => (
  <th className={`ui-table-th ${alignRight ? 'align-right' : ''} ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell: React.FC<
  React.TdHTMLAttributes<HTMLTableCellElement> & { alignRight?: boolean }
> = ({ children, alignRight, className = '', ...props }) => (
  <td className={`ui-table-td ${alignRight ? 'align-right' : ''} ${className}`} {...props}>
    {children}
  </td>
);

export default Table;
