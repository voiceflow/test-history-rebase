export interface PubSubPayload {
  requestID: string;
}

export interface PubSubRequest<Params> extends PubSubPayload {
  params: Params;
}

export interface PubSubResponse<Result = unknown> extends PubSubPayload {
  result: Result;
}
