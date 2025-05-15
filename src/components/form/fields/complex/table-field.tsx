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
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  const [editingRow, setEditingRow] = useState<TableRowType | null>(null);
  const [nextId, setNextId] = useState<number>(1);

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

    setEditingRow(newRow);
    setNextId(nextId + 1);
  };

  const saveRow = () => {
    if (!editingRow) return;

    const existingRowIndex = rows.findIndex((row) => row.id === editingRow.id);
    let updatedRows: TableRowType[];

    if (existingRowIndex >= 0) {
      // Atualizar linha existente
      updatedRows = [...rows];
      updatedRows[existingRowIndex] = editingRow;
    } else {
      // Adicionar nova linha
      updatedRows = [...rows, editingRow];
    }

    setRows(updatedRows);
    field.setValue(updatedRows);
    setEditingRow(null);
  };

  const editRow = (row: TableRowType) => {
    setEditingRow({ ...row });
  };

  const deleteRow = (id: number | string) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    field.setValue(updatedRows);
  };

  const cancelEdit = () => {
    setEditingRow(null);
  };

  const updateEditingField = (key: string, value: any) => {
    if (!editingRow) return;
    setEditingRow({ ...editingRow, [key]: value });
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

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <Card>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.header}</TableHead>
                ))}
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={`${row.id}-${column.key}`}>
                        {formatCellValue(row[column.key], column.type)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => editRow(row)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRow(row.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
      </Card>

      {editingRow ? (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {columns.map((column) => (
                <div key={column.key} className="grid gap-1.5">
                  <label
                    htmlFor={`edit-${column.key}`}
                    className="text-sm font-medium"
                  >
                    {column.header}
                  </label>
                  <Input
                    id={`edit-${column.key}`}
                    type={
                      column.type === 'currency' || column.type === 'number'
                        ? 'number'
                        : column.type
                    }
                    value={editingRow[column.key] || ''}
                    onChange={(e) => {
                      const value =
                        column.type === 'currency' || column.type === 'number'
                          ? Number.parseFloat(e.target.value) || ''
                          : e.target.value;
                      updateEditingField(column.key, value);
                    }}
                    step={column.type === 'currency' ? '0.01' : undefined}
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="button" onClick={saveRow}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={addRow}
          className="mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar linha
        </Button>
      )}

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default TableFieldComponent;
