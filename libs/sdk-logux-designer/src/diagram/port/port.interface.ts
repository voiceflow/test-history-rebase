import type { Link } from '../link/link.interface';

export interface Port {
  key: string;
  link: Link | null;
}
