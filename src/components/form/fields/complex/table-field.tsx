'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit, X, ArrowUpDown, Check } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TableFieldProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  columns: Array<{
    key: string;
    header: string;
    type: 'text' | 'number' | 'email' | 'currency' | 'date';
  }>;
}

interface TableRowType {
  id: number | string;
  [key: string]: any;
}

const TableFieldComponent = ({
  label,
  id,
  description,
  required,
  columns,
}: TableFieldProps) => {
  const field = useFieldContext<TableRowType[]>();
  const [rows, setRows] = useState<TableRowType[]>(field.state.value || []);
  const [editingRowId, setEditingRowId] = useState<string | number | null>(
    null,
  );
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});
  const [nextId, setNextId] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  }>({ key: '', direction: null });

  useEffect(() => {
    if (field.state.value) {
      setRows(field.state.value);

      // Encontrar o maior ID para continuar a sequência
      const maxId = field.state.value.reduce((max, row) => {
        const rowId =
          typeof row.id === 'number'
            ? row.id
            : Number.parseInt(row.id as string, 10);
        return isNaN(rowId) ? max : Math.max(max, rowId);
      }, 0);

      setNextId(maxId + 1);
    }
  }, [field.state.value]);

  const addRow = () => {
    const newRow: TableRowType = { id: nextId };
    columns.forEach((column) => {
      newRow[column.key] = '';
    });

    // Add the row and immediately set it to editing mode
    const updatedRows = [...rows, newRow];
    setRows(updatedRows as TableRowType[]);
    field.setValue(updatedRows as TableRowType[]);
    setNextId(nextId + 1);

    // Set this row to editing mode
    startEditing(newRow.id, newRow);
  };

  const startEditing = (rowId: number | string, row: TableRowType) => {
    setEditingRowId(rowId);
    setEditingValues({ ...row });
  };

  const cancelEditing = () => {
    setEditingRowId(null);
    setEditingValues({});
  };

  const saveEditing = () => {
    if (!editingRowId) return;

    const updatedRows = rows.map((row) =>
      row.id === editingRowId ? { ...editingValues } : row,
    );

    setRows(updatedRows as TableRowType[]);
    field.setValue(updatedRows as TableRowType[]);
    setEditingRowId(null);
    setEditingValues({});
  };

  const updateEditingField = (key: string, value: any) => {
    setEditingValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const deleteRow = (id: number | string) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    field.setValue(updatedRows);

    // If we're deleting the row we're editing, cancel editing
    if (editingRowId === id) {
      cancelEditing();
    }
  };

  const formatCellValue = (value: any, type: string) => {
    if (value === undefined || value === null || value === '') return '';

    switch (type) {
      case 'currency':
        return typeof value === 'number'
          ? value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
          : value;
      case 'date':
        return value instanceof Date ? value.toLocaleDateString() : value;
      default:
        return value;
    }
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ key, direction });

    if (direction === null) {
      // Reset to original order based on ID
      const sortedRows = [...rows].sort((a, b) => {
        const aId = typeof a.id === 'number' ? a.id : Number(a.id);
        const bId = typeof b.id === 'number' ? b.id : Number(b.id);
        return aId - bId;
      });
      setRows(sortedRows);
      field.setValue(sortedRows);
    } else {
      const sortedRows = [...rows].sort((a, b) => {
        if (a[key] === b[key]) return 0;

        // Handle different types
        const aValue = a[key] === '' ? null : a[key];
        const bValue = b[key] === '' ? null : b[key];

        // Null values always go to the end
        if (aValue === null) return 1;
        if (bValue === null) return -1;

        // Sort based on type
        if (direction === 'asc') {
          return aValue < bValue ? -1 : 1;
        } else {
          return aValue > bValue ? -1 : 1;
        }
      });

      setRows(sortedRows);
      field.setValue(sortedRows);
    }
  };

  const renderCell = (
    row: TableRowType,
    column: TableFieldProps['columns'][0],
  ) => {
    const isEditing = row.id === editingRowId;

    if (isEditing) {
      return (
        <Input
          type={
            column.type === 'currency' || column.type === 'number'
              ? 'number'
              : column.type
          }
          value={editingValues[column.key] || ''}
          onChange={(e) => {
            const value =
              column.type === 'currency' || column.type === 'number'
                ? Number.parseFloat(e.target.value) || ''
                : e.target.value;
            updateEditingField(column.key, value);
          }}
          step={column.type === 'currency' ? '0.01' : undefined}
          className="h-8 px-2 py-1 text-sm"
        />
      );
    } else {
      return formatCellValue(row[column.key], column.type);
    }
  };

  const renderActionCell = (row: TableRowType) => {
    const isEditing = row.id === editingRowId;

    if (isEditing) {
      return (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={cancelEditing}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={saveEditing}
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => startEditing(row.id, row)}
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteRow(row.id)}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  };

  return (
    <FieldWrapper>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <LabelArea label={label} htmlFor={id} required={required} />
          <Badge variant="outline" className="text-xs font-normal">
            {rows.length} registros
          </Badge>
        </div>
      )}

      <Card className="border border-border/50 shadow-sm">
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => requestSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {sortConfig.key === column.key && (
                        <ArrowUpDown
                          className={cn(
                            'ml-1 h-4 w-4',
                            sortConfig.direction === 'asc' &&
                              'text-primary rotate-180',
                            sortConfig.direction === 'desc' && 'text-primary',
                          )}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      'group',
                      row.id === editingRowId && 'bg-muted/20',
                    )}
                  >
                    {columns.map((column) => (
                      <TableCell key={`${row.id}-${column.key}`}>
                        {renderCell(row, column)}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      {renderActionCell(row)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="text-center h-24 text-muted-foreground"
                  >
                    Nenhum dado encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="p-3 border-t bg-muted/10">
          <Button
            type="button"
            variant="outline"
            onClick={addRow}
            className="ml-auto group hover:border-primary/50 transition-colors"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
            Adicionar linha
          </Button>
        </CardFooter>
      </Card>

      {description && (
        <span className="text-sm text-muted-foreground mt-2 block">
          {description}
        </span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default TableFieldComponent;
