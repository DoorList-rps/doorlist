export const formatCurrency = (value: string | null) => {
  if (!value) return 'N/A';
  
  // Remove any existing formatting and convert to number
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  
  if (isNaN(numericValue)) return value;
  
  // Format based on size
  if (numericValue >= 1e9) {
    return `$${(numericValue / 1e9).toFixed(0)} Billion`;
  } else if (numericValue >= 1e6) {
    return `$${(numericValue / 1e6).toFixed(0)} Million`;
  } else if (numericValue >= 1e3) {
    return `$${(numericValue / 1e3).toFixed(0)} Thousand`;
  }
  
  return `$${numericValue.toLocaleString()}`;
};