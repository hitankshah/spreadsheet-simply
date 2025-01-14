import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Calculator,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Hash,
  Scissors,
  Type,
  Strikethrough,
  Replace,
  Undo2,
  Redo2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ToolbarProps {
  onFunction: (type: string, params?: any) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  onFunction, 
  canUndo, 
  canRedo, 
  onUndo, 
  onRedo 
}) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const handleFunction = (type: string) => {
    onFunction(type);
    toast(`Applied ${type} function`);
  };

  const handleFindReplace = () => {
    onFunction('FIND_REPLACE', { find: findText, replace: replaceText });
    toast('Find and Replace applied');
  };

  return (
    <div className="p-2 bg-sheet-header border-b border-sheet-border flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('SUM')}
        >
          <Calculator className="w-4 h-4 mr-1" />
          SUM
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('AVERAGE')}
        >
          <ArrowUpDown className="w-4 h-4 mr-1" />
          AVG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('MAX')}
        >
          <ArrowUp className="w-4 h-4 mr-1" />
          MAX
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('MIN')}
        >
          <ArrowDown className="w-4 h-4 mr-1" />
          MIN
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('COUNT')}
        >
          <Hash className="w-4 h-4 mr-1" />
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
          <Scissors className="w-4 h-4 mr-1" />
          TRIM
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('UPPER')}
        >
          <Type className="w-4 h-4 mr-1" />
          UPPER
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFunction('LOWER')}
        >
          <Strikethrough className="w-4 h-4 mr-1" />
          LOWER
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Replace className="w-4 h-4 mr-1" />
              Find & Replace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Find and Replace</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Find</Label>
                <Input
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder="Text to find..."
                />
              </div>
              <div className="space-y-2">
                <Label>Replace</Label>
                <Input
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Replace with..."
                />
              </div>
              <Button onClick={handleFindReplace}>Apply</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};