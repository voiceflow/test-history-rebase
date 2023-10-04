export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface ViewportModel extends Viewport {
  /**
   * the ID of the Diagram for which this is a viewport
   */
  id: string;

  versionID: string;
}
