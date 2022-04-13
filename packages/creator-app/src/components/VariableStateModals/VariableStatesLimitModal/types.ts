export interface LimitSubmitProps {
  openPaymentModal: () => void;
}

export interface LimitDetails {
  title: string;
  description: string;
  submitText: string;
  onSubmit: (props: LimitSubmitProps) => void;
}

// refactor - move type defs to shared constants or internal
export enum VariableStatesLimits {
  TEAM = 'team',
  STARTER = 'starter',
}
