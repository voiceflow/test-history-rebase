import { BaseText } from '@voiceflow/base-types';

import SlateEditable from '@/components/SlateEditable';

export const textFieldHasValue = (data: string | BaseText.SlateTextValue): boolean =>
  (typeof data === 'string' && data.length > 0) || (Array.isArray(data) && !SlateEditable.EditorAPI.isNewState(data));
