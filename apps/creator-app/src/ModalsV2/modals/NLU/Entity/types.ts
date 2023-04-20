import * as Realtime from '@voiceflow/realtime-sdk';
import * as Yup from 'yup';

export const SCHEME = Yup.object({
  values: Yup.array().notRequired(),
  name: Yup.string(),
  color: Yup.string(),
  type: Yup.string(),
});

export interface FormValues {
  name: string;
  color: string;
  values: Realtime.SlotInput[];
  type: string;
}
