export class UndoRedoStack<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];

  push(state: T) {
    this.undoStack.push(JSON.parse(JSON.stringify(state)));
    this.redoStack = []; // Clear redo stack when new action is performed
  }

  undo(currentState: T): T | null {
    if (this.undoStack.length === 0) return null;
    
    const previousState = this.undoStack.pop()!;
    this.redoStack.push(JSON.parse(JSON.stringify(currentState)));
    return previousState;
  }

  redo(currentState: T): T | null {
    if (this.redoStack.length === 0) return null;
    
    const nextState = this.redoStack.pop()!;
    this.undoStack.push(JSON.parse(JSON.stringify(currentState)));
    return nextState;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}