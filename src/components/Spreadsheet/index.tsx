import React, { useState } from 'react';
import { Grid } from './Grid';
import { Toolbar } from './Toolbar';

const COLS = 26;
const ROWS = 50;

export const Spreadsheet = () => {
  const [data, setData] = useState<string[][]>(
    Array(ROWS).fill(Array(COLS).fill(''))
  );
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const newData = data.map((rowData, i) =>
      i === row
        ? rowData.map((cellData, j) => (j === col ? value : cellData))
        : rowData
    );
    setData(newData);
  };

  const applyFunction = (type: string) => {
    if (!selectedCell) return;

    const currentValue = data[selectedCell.row][selectedCell.col];

    switch (type) {
      case 'TRIM':
        handleCellChange(
          selectedCell.row,
          selectedCell.col,
          currentValue.trim()
        );
        break;
      case 'UPPER':
        handleCellChange(
          selectedCell.row,
          selectedCell.col,
          currentValue.toUpperCase()
        );
        break;
      case 'LOWER':
        handleCellChange(
          selectedCell.row,
          selectedCell.col,
          currentValue.toLowerCase()
        );
        break;
      // Mathematical functions would go here in future iterations
      default:
        break;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Toolbar onFunction={applyFunction} />
      <Grid
        data={data}
        selectedCell={selectedCell}
        onCellSelect={handleCellSelect}
        onCellChange={handleCellChange}
      />
    </div>
  );
};