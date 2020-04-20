import { ContentContainer, Header } from '@/components/Section';
import { styled, units } from '@/hocs';
import { Outter } from '@/pages/TestingV2/components/TestingDialog/components/Container';

const TestSidebar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  user-select: none;

  ${Outter} {
    border-top: 1px solid #eaeff4;
  }

  ${Header}, ${ContentContainer} {
    padding-right: ${units(3)}px;
    padding-left: ${units(3)}px;
  }
`;

export default TestSidebar;
