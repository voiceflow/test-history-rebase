import { styled } from '@/hocs/styled';

import Card from '../Card';

export const Container = styled(Card)`
  display: flex;
  justify-content: space-between;
  padding: 24px 32px;
  background-color: rgb(249, 249, 249);
  background-image: repeating-linear-gradient(
    132deg,
    transparent,
    transparent 34px,
    rgba(216, 216, 216, 0.1) 18px,
    rgba(216, 216, 216, 0.1) 52px
  );
`;

export const LeftSection = styled.div`
  flex: 5;
`;

export const RightSection = styled.div`
  flex: 1;
`;

export const Title = styled.div`
  color: #132144;
  margin-bottom: 4px;
  font-size: 15px;
  font-weight: 600;
`;

export const Description = styled.div`
  color: #62778c;
  font-size: 13px;
`;
