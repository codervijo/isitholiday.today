import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cloudflare Pages serves vite-react-ssg's nested `<path>/index.html` output at
// `/<path>/` and 308-redirects the no-slash form. Every internal href, canonical,
// and sitemap <loc> must use the slashed form so none of them point at a redirect.
export function withTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}
