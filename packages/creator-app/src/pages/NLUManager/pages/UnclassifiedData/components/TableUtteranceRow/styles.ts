import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

import { SimilarityColors } from './constants';

export const SimilarityText = styled.div<{ color: SimilarityColors }>`
  font-weight: 600;
  font-size: 13px;
  color: ${(props) => props.color};
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
`;

export const CopyIconContainer = styled.div`
  margin-left: 16px;
  margin-right: 4px;
  height: 36px;
  width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DeleteIconContainer = styled.div`
  height: 36px;
  width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
