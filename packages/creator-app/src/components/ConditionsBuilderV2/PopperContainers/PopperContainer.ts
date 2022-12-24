import { Popper } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const PopperContainer = styled.div`
  ${Popper.baseStyles}

  min-width: 578px;
  background-image: linear-gradient(to bottom, var(--white), #fdfdfd);
`;

export default PopperContainer;
