export interface ColorState {
  backgroundColor: string;
  color: string;
}

export class ColorStack {
  private stack: ColorState[] = [];
  
  push(state: ColorState) {
    this.stack.push(state);
  }
  
  pop(): ColorState | undefined {
    return this.stack.pop();
  }
  
  peek(): ColorState | undefined {
    return this.stack[this.stack.length - 1];
  }
  
  clear() {
    this.stack = [];
  }
}