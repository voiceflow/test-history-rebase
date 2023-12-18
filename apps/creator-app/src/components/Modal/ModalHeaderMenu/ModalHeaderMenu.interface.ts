interface ModalHeaderMenuOption {
  id: string;
  name: string;
}

export interface IModalHeaderMenu {
  items: ModalHeaderMenuOption[];
  activeID: string | null;
  onSelect: (id: string) => void;
  notFoundLabel: string;
}
