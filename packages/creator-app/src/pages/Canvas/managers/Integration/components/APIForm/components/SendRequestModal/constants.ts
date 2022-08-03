import { ACE_EDITOR_COLORS } from '@/components/AceEditor';

export const RAW_ACE_EDITOR_COLORS = Object.keys(ACE_EDITOR_COLORS).reduce((acc, colorKey) => ({ ...acc, [colorKey]: '#132144' }), {} as any);

export enum ModalTabs {
  BODY = 'body',
  HEADERS = 'headers',
}
