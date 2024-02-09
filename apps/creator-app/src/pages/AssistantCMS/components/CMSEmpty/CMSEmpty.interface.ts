import type { BaseProps, IEmptyPage } from '@voiceflow/ui-next';

export interface ICMSEmpty extends Omit<IEmptyPage, 'button' | 'testID'>, React.PropsWithChildren {
  button?: { label: string; onClick: (search: string) => void } & BaseProps;
  searchTitle: string;
}
