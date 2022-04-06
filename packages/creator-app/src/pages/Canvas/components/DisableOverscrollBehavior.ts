import { createGlobalStyle } from '@/hocs';

const DisableOverscrollBehavior = createGlobalStyle`
  html, body {
    overscroll-behavior-x: none;
  }
`;

export default DisableOverscrollBehavior;
