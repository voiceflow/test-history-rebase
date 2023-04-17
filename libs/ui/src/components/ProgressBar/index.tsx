import React from 'react';

import * as S from './styles';

export interface ProgressBarPropsProps {
  color: string;
  width?: number | string;
  height: number;
  loading?: boolean;
  background?: string;
  /**
   * value between 0 and 1
   */
  progress: number;
}

const ProgressBarProps: React.FC<ProgressBarPropsProps> = ({ color, width, loading, height, progress, background }) => (
  <S.Container width={width} height={height} loading={loading} background={background}>
    {!loading && <S.Progress color={color} height={height} progress={progress}></S.Progress>}
  </S.Container>
);

export default ProgressBarProps;
