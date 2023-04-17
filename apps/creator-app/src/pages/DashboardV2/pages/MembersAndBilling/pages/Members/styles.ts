import { Banner } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const StyledBanner = styled(Banner)`
  ${Banner.Container} {
    background-size: 332px;
    background-position: right 38px top 17.5%;
  }
`;
