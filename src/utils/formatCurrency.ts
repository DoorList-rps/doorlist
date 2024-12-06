export const formatCurrency = (value: string | null) => {
  if (!value) return 'N/A';
  
  // Remove any existing formatting and convert to number
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  
  if (isNaN(numericValue)) return value;
  
  // Format based on size
  if (numericValue >= 1e9) {
    return `$${Math.floor(numericValue / 1e9)}B`;
  } else if (numericValue >= 1e6) {
    return `$${Math.floor(numericValue / 1e6)}M`;
  } else if (numericValue >= 1e3) {
    return `$${Math.floor(numericValue / 1e3)}K`;
  }
  
  return `$${numericValue.toLocaleString()}`;
};