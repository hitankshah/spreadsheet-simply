import React, { useState, useRef } from 'react';
import { generateColumnLabel, evaluateFormula } from '@/lib/spreadsheet-utils';
import * as spreadsheetFunctions from '@/lib/spreadsheet-functions';
import { Button } from '@/components/ui/button';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Save, Upload, Type, Palette } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ColorStack, ColorState } from '@/lib/ColorStack';
import { Toolbar } from './Toolbar';
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
  const [selectedRange, setSelectedRange] = useState<string[]>([]);
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

  const handleFunction = (type: string, params?: any) => {
    if (!selectedCell && selectedRange.length === 0) {
      toast({
        title: "Error",
        description: "Please select a cell or range first",
        variant: "destructive"
      });
      return;
    }

    const values = selectedRange.map(ref => cells[ref]?.value || '');
    let result: string | number = '';

    switch (type) {
      case 'SUM':
        result = spreadsheetFunctions.calculateSum(values);
        break;
      case 'AVERAGE':
        result = spreadsheetFunctions.calculateAverage(values);
        break;
      case 'MAX':
        result = spreadsheetFunctions.findMax(values);
        break;
      case 'MIN':
        result = spreadsheetFunctions.findMin(values);
        break;
      case 'COUNT':
        result = spreadsheetFunctions.count(values);
        break;
      case 'TRIM':
        if (selectedCell) {
          result = spreadsheetFunctions.trim(cells[selectedCell]?.value || '');
        }
        break;
      case 'UPPER':
        if (selectedCell) {
          result = spreadsheetFunctions.upper(cells[selectedCell]?.value || '');
        }
        break;
      case 'LOWER':
        if (selectedCell) {
          result = spreadsheetFunctions.lower(cells[selectedCell]?.value || '');
        }
        break;
      case 'FIND_REPLACE':
        if (params?.find && params?.replace) {
          const newValues = spreadsheetFunctions.findAndReplace(values, params.find, params.replace);
          selectedRange.forEach((ref, index) => {
            handleCellChange(ref, newValues[index]);
          });
          return;
        }
        break;
    }

    if (selectedCell && result !== '') {
      handleCellChange(selectedCell, String(result));
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Toolbar onFunction={handleFunction} />
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
