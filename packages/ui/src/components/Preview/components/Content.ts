import { styled } from '@ui/styles';

import PreviewContentItem from './ContentItem';

const PreviewContent = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 16px;
  padding-top: 7px;
  max-height: 207px;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  ${PreviewContentItem} {
    margin-top: 12px;

    &:first-child {
      margin-top: 0px;
    }
  }
`;

export default PreviewContent;
