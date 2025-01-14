import React, { useState, useRef } from 'react';
import { generateColumnLabel, evaluateFormula } from '@/lib/spreadsheet-utils';
import { Button } from '@/components/ui/button';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Save, Upload, Type, Palette } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ColorStack, ColorState } from '@/lib/ColorStack';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CellData {
  value: string;
  formula: string;
  dataType: 'text' | 'number' | 'date' | 'auto';
  style: {
    bold: boolean;
    italic: boolean;
    align: 'left' | 'center' | 'right';
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontFamily?: string;
  };
}

const ROWS = 100;
const COLS = 26;

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
const fontFamilies = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];
const fontColors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFF00'];

const Spreadsheet = () => {
  const [cells, setCells] = useState<Record<string, CellData>>({});
  const [selectedCell, setSelectedCell] = useState<string>('');
  const [formulaBarValue, setFormulaBarValue] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentRef: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const [col, row] = currentRef.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      const nextRow = parseInt(row) + 1;
      if (nextRow <= ROWS) {
        const nextCellRef = `${col}${nextRow}`;
        setSelectedCell(nextCellRef);
        const nextCell = document.querySelector(`input[data-cell-ref="${nextCellRef}"]`) as HTMLInputElement;
        nextCell?.focus();
      }
    }
  };

  const updateCellStyle = (ref: string, styleUpdate: Partial<CellData['style']>) => {
    setCells(prev => ({
      ...prev,
      [ref]: {
        ...prev[ref],
        style: {
          ...(prev[ref]?.style || { bold: false, italic: false, align: 'left' }),
          ...styleUpdate
        }
      }
    }));
  };

  const handleCellChange = (ref: string, value: string) => {
    setCells(prev => ({
      ...prev,
      [ref]: {
        ...prev[ref],
        value,
        formula: value.startsWith('=') ? value : '',
        dataType: !isNaN(Number(value)) ? 'number' : 'text'
      }
    }));
    setFormulaBarValue(value);
  };

  const handleCellSelect = (ref: string) => {
    setSelectedCell(ref);
    setFormulaBarValue(cells[ref]?.formula || cells[ref]?.value || '');
  };

  const handleFormulaBarChange = (value: string) => {
    setFormulaBarValue(value);
    if (selectedCell) {
      handleCellChange(selectedCell, value);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="toolbar flex items-center gap-2 p-2 border-b">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateCellStyle(selectedCell, { bold: !cells[selectedCell]?.style?.bold })}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateCellStyle(selectedCell, { italic: !cells[selectedCell]?.style?.italic })}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateCellStyle(selectedCell, { align: 'left' })}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateCellStyle(selectedCell, { align: 'center' })}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateCellStyle(selectedCell, { align: 'right' })}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <Select
          value={cells[selectedCell]?.style?.fontSize || '14px'}
          onValueChange={(value) => updateCellStyle(selectedCell, { fontSize: value })}
        >
          <SelectTrigger className="w-[100px]">
            <Type className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Font Size" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map(size => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={cells[selectedCell]?.style?.fontFamily || 'Arial'}
          onValueChange={(value) => updateCellStyle(selectedCell, { fontFamily: value })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Font Family" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map(font => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={cells[selectedCell]?.style?.color || '#000000'}
          onValueChange={(value) => updateCellStyle(selectedCell, { color: value })}
        >
          <SelectTrigger className="w-[100px]">
            <Palette className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Font Color" />
          </SelectTrigger>
          <SelectContent>
            {fontColors.map(color => (
              <SelectItem key={color} value={color}>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: color }}></div>
                  {color}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="formula-bar p-2 border-b flex items-center gap-2">
        <span className="text-sm font-medium">fx</span>
        <input
          type="text"
          value={formulaBarValue}
          onChange={(e) => handleFormulaBarChange(e.target.value)}
          className="flex-1 px-2 py-1 border rounded"
        />
      </div>

      <div className="flex-1 overflow-auto" ref={gridRef}>
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="header-cell"></th>
              {Array.from({ length: COLS }).map((_, index) => (
                <th key={index} className="header-cell">
                  {generateColumnLabel(index)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS }).map((_, row) => (
              <tr key={row}>
                <td className="header-cell">{row + 1}</td>
                {Array.from({ length: COLS }).map((_, col) => {
                  const cellRef = `${generateColumnLabel(col)}${row + 1}`;
                  const cellData = cells[cellRef];
                  return (
                    <td key={col} className="p-0">
                      <input
                        type="text"
                        value={cellData?.value || ''}
                        onChange={(e) => handleCellChange(cellRef, e.target.value)}
                        onFocus={() => handleCellSelect(cellRef)}
                        onKeyDown={(e) => handleKeyDown(e, cellRef)}
                        data-cell-ref={cellRef}
                        className={`spreadsheet-cell ${cellData?.dataType === 'number' ? 'text-right' : ''}`}
                        style={{
                          fontWeight: cellData?.style?.bold ? 'bold' : 'normal',
                          fontStyle: cellData?.style?.italic ? 'italic' : 'normal',
                          textAlign: cellData?.style?.align || 'left',
                          backgroundColor: cellData?.style?.backgroundColor || '',
                          color: cellData?.style?.color || '',
                          fontSize: cellData?.style?.fontSize || '14px',
                          fontFamily: cellData?.style?.fontFamily || 'Arial'
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Spreadsheet;