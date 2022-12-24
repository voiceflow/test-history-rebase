import Section from '@/components/Section';
import HeaderContent from '@/components/Section/components/HeaderContent';
import StatusContent from '@/components/Section/components/StatusContent';
import { styled } from '@/hocs/styled';

const EntitySection = styled(Section)`
  ${HeaderContent} {
    min-width: auto;
  }

  ${HeaderContent} div {
    overflow: visible;
    text-overflow: clip;
  }

  ${StatusContent} {
    overflow: hidden;
    div {
      overflow: hidden;
    }
  }
`;

export default EntitySection;
