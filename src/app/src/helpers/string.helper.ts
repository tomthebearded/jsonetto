export function cutString(str?: string | null): string {
  if (!str?.trim())
    return '';

  return str.length > 17
    ? `${str.slice(0, 17)}...`
    : str;
}
