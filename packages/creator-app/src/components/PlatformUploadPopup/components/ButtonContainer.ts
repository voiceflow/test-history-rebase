import { FlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs';

const ButtonContainer = styled(FlexCenter)`
  margin: 0 -22px -24px;
  padding: 23px 32px 24px;
  background: #f9f9f9;
  border-top: 1px solid #dfe3ed;

  .modal & {
    justify-content: space-between;
    flex-direction: row-reverse;
    margin: 0 -22px -22px -22px;
  }
`;

export default ButtonContainer;
