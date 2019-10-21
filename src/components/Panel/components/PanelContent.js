import { styled } from '@/hocs';

import PanelSection from './PanelSection';

const PanelContent = styled.div`
  height: 100%;
  overflow-y: scroll;
  padding-bottom: ${({ theme }) => theme.unit * 2}px;

  & > ${PanelSection}:last-of-type {
    border-bottom: 0;
  }
`;

export default PanelContent;
