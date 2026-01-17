import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Column, ColumnType } from '@/types/palette';
import { useState, useEffect } from 'react';

interface ColumnEditorProps {
  column: Column;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: Partial<Column>) => void;
  onDelete: () => void;
}

const columnTypes: { value: ColumnType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'link', label: 'Link' },
  { value: 'select', label: 'Select' },
  { value: 'status', label: 'Status' },
  { value: 'tags', label: 'Tags' },
];

export const ColumnEditor = ({ column, open, onOpenChange, onUpdate, onDelete }: ColumnEditorProps) => {
  const [name, setName] = useState(column.name);
  const [type, setType] = useState<ColumnType>(column.type);
  const [formula, setFormula] = useState(column.formula || '');

  useEffect(() => {
    setName(column.name);
    setType(column.type);
    setFormula(column.formula || '');
  }, [column]);

  const handleSave = () => {
    onUpdate({ name, type, formula: formula || undefined });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Column</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Column Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Column Type</Label>
            <Select value={type} onValueChange={(v: ColumnType) => setType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {columnTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {type === 'number' && (
            <div className="space-y-2">
              <Label>Formula (e.g. =SUM(Price))</Label>
              <Input 
                value={formula} 
                onChange={(e) => setFormula(e.target.value)}
                placeholder="=SUM(ColumnName)"
              />
            </div>
          )}
          <div className="flex justify-between pt-4">
            <Button variant="destructive" onClick={onDelete}>Delete Column</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
