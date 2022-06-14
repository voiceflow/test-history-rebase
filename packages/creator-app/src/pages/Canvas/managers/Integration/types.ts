export interface CustomAPITestResponseMetadata {
  size: string;
  time: number;
  isError: boolean;
}

export interface CustomAPITestResponse {
  metadata: CustomAPITestResponseMetadata;
  statusCode: number;
  statusText: string;
  body: string;
  headers: { key: string; val: string }[];
}
