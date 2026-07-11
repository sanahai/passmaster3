export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path: string) {
  return `${basePath}${path}`;
}

/** GitHub Pages(basePath) 환경에서 앵커 링크가 깨지지 않도록 */
export function hash(id: string) {
  return `${basePath}/#${id}`;
}

export function home() {
  return basePath ? `${basePath}/` : "/";
}
