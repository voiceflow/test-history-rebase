interface ModalHeaderMoreOption {
  name: string;
  onClick: VoidFunction;
}

export interface IModalHeaderMore {
  width?: number;
  options: ModalHeaderMoreOption[];
}
