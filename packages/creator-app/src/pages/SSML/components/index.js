import { styled } from '@/hocs';

export { default as App } from './App';
export { default as CodeContainer } from './CodeContainer';
export { default as Page } from './Page';

export const CopiedMessaged = styled.span`
  color: #5d9df5;
  font-size: 13px;
  margin-right: 1rem;
`;

export const HeaderText = styled.h1`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0;
`;
