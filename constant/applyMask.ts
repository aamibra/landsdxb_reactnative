/**
 * Apply a numeric mask to an input string.
 * @param rawInput Only digits (no formatting)
 * @param pattern Use '9' to indicate number placeholders. E.g., '999-99999'
 */
export const applyMask = (rawInput: string, pattern: string) => {
  const digits = rawInput.replace(/\D/g, '');
  let result = '';
  let digitIndex = 0;

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    if (char === '9') {
      if (digitIndex < digits.length) {
        result += digits[digitIndex];
        digitIndex++;
      } else {
        break;
      }
    } else {
      // Non-placeholder (like dash or space)
      if (digitIndex < digits.length) {
        result += char;
      }
    }
  }

  return result;
};

export const numberWithCommas = (x) =>{
  if (x == null) return '';
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export const removeCommas = (x) =>  {
  if (x == null) return '';
  return x.toString().replace(/,/g, '');
}

export const numberCommas = (x) => {
  if (!x) return '';

  const num = x.toString().replace(/,/g, '');

  // تحقق إذا الإدخال رقم عشري فقط
  if (!/^\d*\.?\d*$/.test(num)) return '';

  return parseFloat(num).toLocaleString('en-US');
};
 
export  const cleanNumber = (val) => {
    if (!val) return NaN;

    const cleaned = val.toString().replace(/,/g, '');

    return isNaN(cleaned) ? NaN : parseFloat(cleaned);
 };
