import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface CellProps {
  value: string;
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
  onSelect: (rowIndex: number, colIndex: number) => void;
  onChange: (value: string) => void;
}

export const Cell: React.FC<CellProps> = ({
  value,
  rowIndex,
  colIndex,
  isSelected,
  onSelect,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleClick = () => {
    onSelect(rowIndex, colIndex);
  };

  return (
    <div
      className={cn(
        "border-r border-b border-sheet-border min-w-[100px] h-[25px] relative",
        isSelected && "bg-sheet-selected"
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="w-full h-full px-1 outline-none border-none bg-white"
        />
      ) : (
        <div className="px-1 overflow-hidden whitespace-nowrap text-sm">
          {value}
        </div>
      )}
    </div>
  );
};