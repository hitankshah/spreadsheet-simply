export const generateColumnLabel = (index: number): string => {
  let label = '';
  while (index >= 0) {
    label = String.fromCharCode(65 + (index % 26)) + label;
    index = Math.floor(index / 26) - 1;
  }
  return label;
};

export const evaluateFormula = (formula: string, getCellValue: (ref: string) => string): string => {
  if (!formula.startsWith('=')) return formula;
  
  try {
    // Remove the '=' sign
    const expression = formula.substring(1);
    
    // Replace cell references with their values
    const evaluatedExpression = expression.replace(/[A-Z]+[0-9]+/g, (match) => {
      const value = getCellValue(match);
      return isNaN(Number(value)) ? '0' : value;
    });
    
    // Evaluate the expression
    return String(eval(evaluatedExpression));
  } catch (error) {
    return '#ERROR!';
  }
};