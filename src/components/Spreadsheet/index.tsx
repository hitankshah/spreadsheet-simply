import React, { useState, useRef } from 'react';
import { generateColumnLabel, evaluateFormula } from '@/lib/spreadsheet-utils';
import * as spreadsheetFunctions from '@/lib/spreadsheet-functions';
import { Grid } from './Grid';
import { Toolbar } from './Toolbar';
import { UndoRedoStack } from '@/lib/UndoRedoStack';
import { toast } from "sonner";

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

const Spreadsheet = () => {
  const [data, setData] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ row: number; col: number }[]>([]);
  const undoRedoStack = useRef(new UndoRedoStack<string[][]>());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateData = (newData: string[][]) => {
    undoRedoStack.current.push(data);
    setData(newData);
    setCanUndo(true);
    setCanRedo(false);
  };

  const handleUndo = () => {
    const previousState = undoRedoStack.current.undo(data);
    if (previousState) {
      setData(previousState);
      setCanRedo(true);
      setCanUndo(undoRedoStack.current.canUndo());
    }
  };

  const handleRedo = () => {
    const nextState = undoRedoStack.current.redo(data);
    if (nextState) {
      setData(nextState);
      setCanUndo(true);
      setCanRedo(undoRedoStack.current.canRedo());
    }
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const newData = [...data];
    if (!newData[row]) newData[row] = [];
    newData[row][col] = value;
    updateData(newData);
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

    const values = selectedRange.map(({ row, col }) => data[row]?.[col] || '');
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
          result = spreadsheetFunctions.trim(data[selectedCell.row]?.[selectedCell.col] || '');
        }
        break;
      case 'UPPER':
        if (selectedCell) {
          result = spreadsheetFunctions.upper(data[selectedCell.row]?.[selectedCell.col] || '');
        }
        break;
      case 'LOWER':
        if (selectedCell) {
          result = spreadsheetFunctions.lower(data[selectedCell.row]?.[selectedCell.col] || '');
        }
        break;
      case 'FIND_REPLACE':
        if (params?.find && params?.replace) {
          const newValues = spreadsheetFunctions.findAndReplace(values, params.find, params.replace);
          selectedRange.forEach(({ row, col }, index) => {
            handleCellChange(row, col, newValues[index]);
          });
          return;
        }
        break;
    }

    if (selectedCell && result !== '') {
      handleCellChange(selectedCell.row, selectedCell.col, String(result));
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Toolbar 
        onFunction={handleFunction}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <Grid
        data={data}
        selectedCell={selectedCell}
        onCellSelect={handleCellSelect}
        onCellChange={handleCellChange}
      />
    </div>
  );
};

export default Spreadsheet;