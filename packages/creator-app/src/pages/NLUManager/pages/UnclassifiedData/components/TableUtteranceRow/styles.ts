import { Box, Checkbox, Text } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

import { SimilarityColors } from './constants';

export const SimilarityText = styled.div<{ color: SimilarityColors }>`
  font-weight: 600;
  font-size: 13px;
  color: ${(props) => props.color};
  padding-top: 2px;
`;

export const Dot = styled.div`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #62778c;
  opacity: 50%;
  margin-left: 8px;
  margin-right: 8px;
`;

export const TextContainer = styled(Box)`
  b {
    text-decoration: underline;
  }
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RowDetailsText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: #62778c;
`;

export const UtteranceRowCheckbox = styled(Checkbox)`
  margin-right: -1px;
  padding-top: 2px;
`;
