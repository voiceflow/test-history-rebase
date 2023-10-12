import type { LinkType } from './link-type.enum';

export interface Link {
  type: LinkType | null;
  nodeID: string;
  color: string | null;
  caption: Link.Caption | null;
  points: Link.Point[] | null;
}

export namespace Link {
  export interface Caption {
    text: string;
    width: number;
    height: number;
  }

  export interface Point {
    point: [x: number, y: number];
    toTop?: boolean;
    locked?: boolean;
    reversed?: boolean;
    allowedToTop?: boolean;
  }
}
