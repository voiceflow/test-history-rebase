import { Container as CollapsableContainer, Header as CollapsableHeader } from '@/components/Collapsable/components';
import { styled } from '@/hocs';
import { FadeRight } from '@/styles/animations';

const Container = styled.div`
  padding: 11px 16px;
  ${FadeRight}

  ${CollapsableHeader} {
    color: #62778c;
    height: 30px;
    font-size: 13px;
  }

  ${CollapsableContainer} {
    margin-bottom: 0px;
  }
`;

export default Container;
