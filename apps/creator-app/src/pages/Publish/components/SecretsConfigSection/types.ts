import { ProjectSecretTag } from '@voiceflow/schema-types';

export interface InputField {
  description: string;
  isConfidential: boolean;
  placeholder: string;
}

export interface SecretField {
  name: string;
  secretTag: ProjectSecretTag;
  uiConfig: InputField;
}
