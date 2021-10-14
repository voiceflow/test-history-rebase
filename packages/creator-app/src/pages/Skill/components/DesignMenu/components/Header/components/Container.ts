import Tab from '@/components/Tabs/components/Tab';
import { styled } from '@/hocs';

const Container = styled.div`
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding: 0 16px;
  background-color: #fff;
  box-shadow: 0px 0px 0px 1px rgba(19, 33, 68, 0.08), 0px 1px 3px 0px rgba(19, 33, 68, 0.06);
  position: relative;
  z-index: 1;

  ${Tab} {
    font-size: 13px;
    padding: 0 10px;
  }
`;

export default Container;
