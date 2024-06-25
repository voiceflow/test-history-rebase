import { css, styled } from '@/hocs/styled';

interface ContainerProps {
  $active: boolean;
  onClick?: VoidFunction;
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  padding: 16px 24px;
  border: 1px solid ${({ $active }) => ($active ? '#3D82E2' : '#e1e4e7')};
  border-radius: 8px;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  background-color: ${({ $active }) => ($active ? 'rgba(93, 157, 245, 0.1)' : 'transparent')};
  transition:
    border-color 0.2s,
    background-color 0.2s;
  ${({ onClick }) =>
    onClick &&
    css`
      &:hover {
        border-color: #3d82e2;
      }
    `}
`;

export const Title = styled.span`
  color: #132144;
  font-weight: 600;
  font-size: 15px;
`;

export const Period = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: #62778c;
`;

export const Description = styled.div`
  max-width: 326px;
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: #62778c;
`;
