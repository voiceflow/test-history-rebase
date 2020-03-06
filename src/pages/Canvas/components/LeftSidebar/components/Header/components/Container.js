import Tab from '@/components/Tabs/components/Tab';
import { styled } from '@/hocs';

const Container = styled.div`
  width: 100%;
  height: 42px;
  padding: 0 16px;
  background-color: #fff;
  box-shadow: 0 0 1px 0 rgba(19, 33, 68, 0.08), 0 1px 3px 0 rgba(19, 33, 68, 0.08);
  position: relative;
  z-index: 1;

  ${Tab} {
    font-size: 13px;
    padding: 0 12px;
  }
`;

export default Container;
