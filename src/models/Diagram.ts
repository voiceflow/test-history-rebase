export type Diagram = {
  id: string;
  name: string;
  subDiagrams: string[];
};

export type DBDiagram = {
  id: string;
  name: string;
  sub_diagrams?: string;
};
