export interface BasePubSubPayload {
  reqGUID: string;
}

export interface InternalPubSubRequest extends BasePubSubPayload {
  mode: string;
  modeUUID: string;
}
