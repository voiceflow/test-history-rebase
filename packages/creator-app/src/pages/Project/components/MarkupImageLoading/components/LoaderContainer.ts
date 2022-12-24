import { FlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const LoaderContainer = styled(FlexCenter)`
  position: absolute;
  top: 50%;
  left: 50%;

  width: 32vw;
  height: 55vh;
  min-width: 200px;
  min-height: 200px;
  max-width: 500px;
  max-height: 500px;

  transform: translate(-50%, -50%);

  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
  background-color: #fff;
`;

export default LoaderContainer;
