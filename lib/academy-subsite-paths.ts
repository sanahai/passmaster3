export function subsiteBase(subdomain: string): string {
  return `/a/${subdomain}`;
}

export function subsitePath(subdomain: string, path: string): string {
  const base = subsiteBase(subdomain);
  if (!path) return base;
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
