export interface Environment {
  _id: string;
  name: string;
  creatorID: number;
}

export interface EnvironmentRef {
  tag: string;
  environment: Environment;
}
