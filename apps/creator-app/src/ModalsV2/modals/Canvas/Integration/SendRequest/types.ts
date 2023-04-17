export interface ResponseMetadata {
  size: string;
  time: number;
  isError: boolean;
}

export interface Response {
  body: string;
  headers: Array<{ key: string; val: string }>;
  metadata: ResponseMetadata;
  statusCode: number;
  statusText: string;
}
