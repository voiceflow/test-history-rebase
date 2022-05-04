import { styled, units } from '@ui/styles';

const PreventContainerCollapse = styled.div`
  position: absolute;
  height: ${units()}px;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: default;
`;

export default PreventContainerCollapse;
