export function slitIdToNumbers(id: string): number[] {
  const numbers = id.match(/\d+/g).map(Number);
  return numbers;
}
