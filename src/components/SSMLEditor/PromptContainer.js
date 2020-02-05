import { styled } from '@/hocs';

import Effect from './Effect';

const PromptContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  padding: 10px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(17, 49, 96, 0.16), 0 0 0 rgba(17, 49, 96, 0.06);
  transform: translateX(-100%);

  ${Effect}:hover > & {
    display: flex;
    flex-direction: column;
  }
`;

export default PromptContainer;
