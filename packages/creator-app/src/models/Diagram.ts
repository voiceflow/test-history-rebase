export type Diagram = {
  id: string;
  name: string;
  subDiagrams: string[];
  variables: string[];
};

export type DBDiagram = {
  id: string;
  name: string;
  sub_diagrams?: string;
};
