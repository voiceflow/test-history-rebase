import { Box } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { ClassName } from '@/styles/constants';

import { ContentContainer, Placeholder, Title } from './components';

interface FrameProps {
  zoom: number;
  width: number;
  title?: React.ReactNode;
  height: number;
  isRound?: boolean;
  placeholderImage?: null | string;
  className?: string;
}

const Frame: React.FC<FrameProps> = ({ zoom, width, title, height, isRound, children, placeholderImage, className }) => {
  const scale = Math.min(1 / Math.abs(zoom / 100), 8);
  const translate = 100 * (1 - scale);

  return (
    <Box position="relative">
      {title && (
        <Title
          style={{
            transform: zoom <= 100 ? `translateY(${translate - (100 - zoom)}%) scale(${scale})` : `scale(${scale}) translateY(${translate * 2}%)`,
          }}
        >
          {title}
          <span>{zoom.toFixed(0)}% zoom</span>
        </Title>
      )}

      <ContentContainer className={cn(className, ClassName.VISUAL)} isRound={isRound}>
        {children || <Placeholder width={width} height={height} image={placeholderImage} />}
      </ContentContainer>
    </Box>
  );
};

export default Frame;
