export const calculateSum = (values: string[]): number => {
  return values
    .filter(val => !isNaN(Number(val)))
    .reduce((sum, val) => sum + Number(val), 0);
};

export const calculateAverage = (values: string[]): number => {
  const numbers = values.filter(val => !isNaN(Number(val)));
  return numbers.length > 0 ? calculateSum(numbers) / numbers.length : 0;
};

export const findMax = (values: string[]): number => {
  const numbers = values.filter(val => !isNaN(Number(val)));
  return numbers.length > 0 ? Math.max(...numbers.map(Number)) : 0;
};

export const findMin = (values: string[]): number => {
  const numbers = values.filter(val => !isNaN(Number(val)));
  return numbers.length > 0 ? Math.min(...numbers.map(Number)) : 0;
};

export const count = (values: string[]): number => {
  return values.filter(val => !isNaN(Number(val))).length;
};

export const trim = (value: string): string => {
  return value.trim();
};

export const upper = (value: string): string => {
  return value.toUpperCase();
};

export const lower = (value: string): string => {
  return value.toLowerCase();
};

export const removeDuplicates = (values: string[]): string[] => {
  return Array.from(new Set(values));
};

export const findAndReplace = (values: string[], find: string, replace: string): string[] => {
  return values.map(value => value.replace(new RegExp(find, 'g'), replace));
};