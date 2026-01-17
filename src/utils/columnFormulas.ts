import { Column } from '@/types/palette';

export const parseFormula = (formula: string, columns: Column[], tasks: any[]) => {
  if (!formula.startsWith('=')) return null;

  const match = formula.match(/^=(\w+)\((.+)\)$/);
  if (!match) return 'Error: Invalid Syntax';

  const [_, func, colName] = match;
  const targetCol = columns.find(c => c.name.toLowerCase() === colName.toLowerCase());
  
  if (!targetCol) return `Error: Column "${colName}" not found`;

  const values = tasks
    .map(t => t.data?.[targetCol.id])
    .filter(v => v !== undefined && v !== null && v !== '');

  switch (func.toUpperCase()) {
    case 'SUM':
      return values.reduce((acc, v) => acc + (Number(v) || 0), 0);
    case 'AVG':
      return values.length ? values.reduce((acc, v) => acc + (Number(v) || 0), 0) / values.length : 0;
    case 'COUNT':
      return values.length;
    case 'MIN':
      return values.length ? Math.min(...values.map(v => Number(v) || 0)) : 0;
    case 'MAX':
      return values.length ? Math.max(...values.map(v => Number(v) || 0)) : 0;
    default:
      return `Error: Unknown function "${func}"`;
  }
};
