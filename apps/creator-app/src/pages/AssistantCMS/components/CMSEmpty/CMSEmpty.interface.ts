import type { IEmptyPage } from '@voiceflow/ui-next';

export interface ICMSEmpty extends Omit<IEmptyPage, 'button'>, React.PropsWithChildren {
  button?: { label: string; onClick: (search: string) => void };
  searchTitle: string;
}
