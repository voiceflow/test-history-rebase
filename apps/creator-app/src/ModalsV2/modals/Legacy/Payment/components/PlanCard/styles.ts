import { styled } from '@/hocs/styled';

interface ContainerProps {
  $active: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  padding: 16px 24px;
  border: 1px solid ${({ $active }) => ($active ? '#3D82E2' : '#e1e4e7')};
  border-radius: 8px;
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
