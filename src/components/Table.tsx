import React from 'react';

interface TableProps {
  columns: { key: string; label: string; className?: string }[];
  data: Record<string, any>[];
  rowKey: (row: Record<string, any>, idx: number) => string;
  emptyText?: string;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ columns, data, rowKey, emptyText = '데이터가 없습니다.', className = '' }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="min-w-full text-xs sm:text-sm text-center">
      <thead>
        <tr className="bg-blue-50">
          {columns.map(col => (
            <th key={col.key} className={`px-1 sm:px-2 py-1 font-semibold text-gray-700 ${col.className || ''}`}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-gray-400 text-center py-4">{emptyText}</td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={rowKey(row, idx)} className="border-b last:border-b-0 hover:bg-blue-50 transition">
              {columns.map(col => (
                <td key={col.key} className="px-1 sm:px-2 py-2 sm:py-1 whitespace-nowrap">{row[col.key]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
