import React, { useState } from 'react';
import { Cell } from './Cell';

const COLS = 26; // A to Z
const ROWS = 50;

interface GridProps {
  data: string[][];
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
  onCellChange: (row: number, col: number, value: string) => void;
}

export const Grid: React.FC<GridProps> = ({
  data,
  selectedCell,
  onCellSelect,
  onCellChange,
}) => {
  const getColumnLabel = (index: number) => String.fromCharCode(65 + index);

  return (
    <div className="overflow-auto">
      <div className="inline-block">
        {/* Column Headers */}
        <div className="flex">
          <div className="w-[40px] h-[25px] bg-sheet-header border-r border-b border-sheet-border"></div>
          {Array.from({ length: COLS }).map((_, index) => (
            <div
              key={`col-${index}`}
              className="min-w-[100px] h-[25px] bg-sheet-header border-r border-b border-sheet-border flex items-center justify-center text-sm font-medium text-gray-600"
            >
              {getColumnLabel(index)}
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex">
            <div className="w-[40px] h-[25px] bg-sheet-header border-r border-b border-sheet-border flex items-center justify-center text-sm font-medium text-gray-600">
              {rowIndex + 1}
            </div>
            {Array.from({ length: COLS }).map((_, colIndex) => (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                value={data[rowIndex]?.[colIndex] || ''}
                rowIndex={rowIndex}
                colIndex={colIndex}
                isSelected={
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                }
                onSelect={onCellSelect}
                onChange={(value) => onCellChange(rowIndex, colIndex, value)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};