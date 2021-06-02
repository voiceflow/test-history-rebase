export const xor = (lhs: boolean, rhs: boolean) => (lhs ? !rhs : rhs);

export const xnor = (lhs: boolean, rhs: boolean) => !xor(lhs, rhs);
