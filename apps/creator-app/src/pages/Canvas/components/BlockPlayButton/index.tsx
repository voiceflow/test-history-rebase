import React from 'react';

import { HSLShades } from '@/constants';

import PlayButton from '../PlayButton';
import * as S from './styles';

interface PlayButtonProps {
  nodeID?: string;
  palette: HSLShades;
}

const BlockPlayButton: React.FC<PlayButtonProps> = ({ nodeID, palette }) => (
  <S.Container>
    <PlayButton nodeID={nodeID} color={palette[700]} />
  </S.Container>
);

export default BlockPlayButton;
