import { styled } from '@/hocs';

export const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 11px 32px 11px 18px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;

  margin-left: -18px;
  :active {
    color: #62778c;
  }

  :hover {
    background-color: rgba(238, 244, 246, 0.85);
  }
`;

export const ActionLabel = styled.div`
  white-space: nowrap;
`;

export const ActionIcon = styled.div`
  margin-left: 200px;
  position: relative;
  top: 3px;
  :hover {
    opacity: 0.8;
  }
`;
