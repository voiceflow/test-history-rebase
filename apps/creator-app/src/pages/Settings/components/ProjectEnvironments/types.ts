export interface Environment {
  _id: string;
  name: string;
  creatorID: number;
  updatedAt: string;
}

export interface EnvironmentRef {
  tag: string;
  environment: Environment;
}
