import { styled } from '@/styles';

import PreviewContentItem from './ContentItem';

const PreviewContent = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 16px;
  max-height: 400px;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  ${PreviewContentItem} {
    margin-top: 8px;

    &:first-child {
      margin-top: 0px;
    }
  }
`;

export default PreviewContent;
