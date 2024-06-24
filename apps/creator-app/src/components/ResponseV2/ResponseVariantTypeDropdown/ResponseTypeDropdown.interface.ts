import type { ResponseType } from '@voiceflow/dtos';

export interface IResponseTypeDropdown {
  value: ResponseType;
  onValueChange: (value: ResponseType) => void;
}
