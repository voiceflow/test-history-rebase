import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Box.FlexCenter)`
  width: 300px;
  padding: 24px;
  flex-direction: column;
`;

export const IconContainer = styled.div`
  width: 104px;
  height: 104px;
  padding: 12px;
  border-radius: 50%;
  background-color: #e3f0ff;
  margin-bottom: 16px;
`;

export const Title = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
`;

export const Description = styled.div`
  margin-bottom: 20px;
  text-align: center;
  color: #62778c;
`;
