export interface VersionCustomBlockParameter {
  id: string;
  name: string;
}

export interface VersionCustomBlock {
  key: string;
  name: string;
  body?: string;
  stop?: boolean;
  paths?: string[];
  defaultPath?: number;
  parameters?: Record<string, VersionCustomBlockParameter>;
}
