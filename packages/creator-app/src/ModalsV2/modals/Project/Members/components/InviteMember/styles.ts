import { Button as UIButton } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Button = styled(UIButton)`
  font-weight: 600;
  letter-spacing: 0.2px;
`;

export const Legend = styled.div`
  margin-top: 16px;
`;
