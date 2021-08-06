export interface Diagram {
  id: string;
  name: string;
  subDiagrams: string[];
  variables: string[];
}

export interface DBDiagram {
  id: string;
  name: string;
  sub_diagrams?: string;
}
