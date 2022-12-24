import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const PreviewCrop = styled.div`
  border-radius: 6px;
  background: linear-gradient(180deg, #eef4f6 85%, #eef4f6 100%);
  border: 1px solid #eaeff4;
  height: 80px;
  width: 96px;
  overflow: hidden;
`;

export const SelectorLine = styled(Box)`
  :before {
    content: '';
    background-color: #d4d9e6;
    height: 3px;
    width: 3px;
    border-radius: 50%;
    display: block;
    position: absolute;
    margin-top: -1.5px;
  }

  position: relative;
  border-top: 1px dashed #d4d9e6;
`;

export const SelectorBox = styled.div`
  border: 1px dashed #d4d9e6;
  height: 36px;
  width: 36px;
  border-radius: 4px;
  margin-right: -2px;
`;
