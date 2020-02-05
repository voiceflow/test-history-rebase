import { styled } from '@/hocs';

import PanelHeader from './PanelHeader';
import PanelSection from './PanelSection';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  & ${PanelSection}, & ${PanelHeader} {
    border-bottom: 1px solid #dfe3ed;
  }

  & ${PanelSection} {
    padding: ${({ theme }) => theme.unit * 2}px;
  }

  & ${PanelHeader} {
    padding: ${({ theme }) => `${theme.unit}px ${theme.unit * 2}px`};
  }

  & > ${PanelSection}:last-of-type {
    border-bottom: 0;
  }
`;

export default PanelContainer;
