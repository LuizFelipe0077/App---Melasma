/**
 * DateTimeFormatter.js
 * Converts between JS Date and the DD/MM/AAAA HH:mm:ss text stored in
 * Google Sheets cells — a spreadsheet is meant to be read by a person, an
 * ISO string isn't. Used only at the repository/mapper boundary; the rest
 * of the app (domain, use cases, API responses) keeps working in Date/ISO,
 * untouched.
 *
 * Google Sheets auto-converts a cell that looks like a date into a native
 * Date when read back via getValues() — fromSheetDateTime handles that case
 * directly. String parsing falls back to a generic `new Date(value)` when
 * the DD/MM/AAAA pattern doesn't match, so rows written before this existed
 * (plain ISO) keep reading correctly with no data migration required.
 */
function pad(n) {
  return String(n).padStart(2, '0');
}

export function toSheetDateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return '';
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

const PT_BR_DATETIME_REGEX = /^(\d{1,2})\/(\d{1,2})\/(\d{4})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/;

export function fromSheetDateTime(value) {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (!value) return null;

  const str = String(value).trim();
  const match = str.match(PT_BR_DATETIME_REGEX);
  if (match) {
    const [, day, month, year, hours, minutes, seconds] = match;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds || 0));
  }

  const generic = new Date(str);
  return isNaN(generic.getTime()) ? null : generic;
}
