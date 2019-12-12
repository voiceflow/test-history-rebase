import { styled } from '@/hocs';

import CodeContainer from './CodeContainer';
import Page from './Page';

const App = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 100px;
  overflow-y: scroll;
`;

const ExportSection = styled.div`
  width: 100%;
  padding-top: 20px;
  text-align: right;

  button {
    display: inline-block;
  }
`;

export { App, CodeContainer, ExportSection, Page };
