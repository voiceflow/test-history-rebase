import { BaseText } from '@voiceflow/base-types';

import { EditorAPI } from '@/components/SlateEditable/editor';

export const textFieldHasValue = (data: string | BaseText.SlateTextValue | undefined): boolean =>
  (data && typeof data === 'string' && data.length > 0) || (Array.isArray(data) && !EditorAPI.isNewState(data));
