import { BaseProps } from '@voiceflow/ui-next';

interface ModalHeaderMenuOption {
  id: string;
  name: string;
}

export interface IModalHeaderMenu extends BaseProps {
  items: ModalHeaderMenuOption[];
  activeID: string | null;
  onSelect: (id: string) => void;
  notFoundLabel: string;
}
