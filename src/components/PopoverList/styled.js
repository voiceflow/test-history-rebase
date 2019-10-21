import { styled } from '@/hocs';

export const PopoverListWrapper = styled.ul`
  margin: 0;
  padding: 8px 0;
  list-style: none;
`;

export const PopoverListNoItem = styled.p`
  pointer-events: none;
  background: none;
  font-size: 15px;
  transition: all 0.1s ease;
  white-space: nowrap;
  margin: 0;
  padding: 0.65rem 1.5rem;

  ${({ muted }) => muted && 'color: #62778c'}
`;

export const PopoverListItem = styled.div`
  font-size: 15px;
  transition: all 0.1s ease;
  white-space: nowrap;
  width: 100%;
  padding: 0.65rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: initial;
  border: 0;
  cursor: pointer;

  &:hover {
    color: #16181b;
    text-decoration: none;
    background-color: #f8f9fa;
  }

  &:active {
    text-decoration: none;
    background-color: #f1f4f7;
  }

  ${({ muted }) => muted && 'color: #62778c'}
`;
