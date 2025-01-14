import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ToolbarProps {
  onFunction: (type: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onFunction }) => {
  const handleFunction = (type: string) => {
    onFunction(type);
    toast(`Applied ${type} function`);
  };

  return (
    <div className="p-2 bg-sheet-header border-b border-sheet-border flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('SUM')}
        >
          SUM
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('AVERAGE')}
        >
          AVERAGE
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('MAX')}
        >
          MAX
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('MIN')}
        >
          MIN
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('COUNT')}
        >
          COUNT
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('TRIM')}
        >
          TRIM
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('UPPER')}
        >
          UPPER
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('LOWER')}
        >
          LOWER
        </Button>
      </div>
    </div>
  );
};