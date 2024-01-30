interface ModalHeaderMoreOption {
  name: string;
  onClick: VoidFunction;
  disabled?: boolean;
}

export interface IModalHeaderMore {
  width?: number;
  options: ModalHeaderMoreOption[];
}
