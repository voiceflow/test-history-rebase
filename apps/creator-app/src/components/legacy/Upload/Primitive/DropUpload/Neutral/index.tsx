import { SvgIconTypes, swallowEvent } from '@voiceflow/ui';
import React from 'react';

import { CornerActionButton } from '../styles';
import * as S from './styles';

interface NeutralProps {
  label?: string;
  cornerIcon?: SvgIconTypes.Icon;
  onCornerAction?: VoidFunction;
}

const Neutral: React.FC<NeutralProps> = ({ onCornerAction, cornerIcon, label = 'file' }) => (
  <>
    {onCornerAction && cornerIcon && (
      <CornerActionButton onClick={swallowEvent(onCornerAction)} size={12} icon={cornerIcon} />
    )}
    <S.Message>
      Drop {label} here or <S.BrowseButton>Browse</S.BrowseButton>
    </S.Message>
  </>
);

export default Neutral;
