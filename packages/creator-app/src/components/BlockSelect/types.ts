export interface BlockOption {
  id: string;
  label: string;
  diagramID: string;
}

export interface TopicBlockOption {
  id: string;
  label: string;
  options: BlockOption[];
}
