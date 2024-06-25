import React from 'react';
import { useSelector } from 'react-redux';

import { voiceflowWordmarkDark } from '@/assets';
import { createGlobalStyle, css } from '@/hocs/styled';

import { EXPORT_WATERMARK_CLASS } from '../constants';

const WatermarkStyles = createGlobalStyle<{ isOnPaidPlan: boolean }>`
  body {
    .${EXPORT_WATERMARK_CLASS} {
      position: absolute;
      ${({ isOnPaidPlan }) =>
        isOnPaidPlan
          ? css`
              width: 20px;
              height: 20px;
            `
          : css`
              width: 215px;
              height: 65px;
              background-image: url(${voiceflowWordmarkDark});
              background-position: 0 0;
              background-repeat: no-repeat;
            `}

    }
  }
`;

const ExportWatermark: React.FC<{ isOnPaidPlan: boolean }> = ({ isOnPaidPlan }) => {
  // required to rerender component on each redux update to position watermark in the right place
  useSelector((state) => state);

  const htmlCache = React.useRef<HTMLElement | null>(null);
  const watermarkCache = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    htmlCache.current = htmlCache.current || document.querySelector('html');

    if (!htmlCache.current) {
      return;
    }

    watermarkCache.current?.remove();

    watermarkCache.current = document.createElement('div');
    watermarkCache.current.classList.add(EXPORT_WATERMARK_CLASS);
    watermarkCache.current.style.top = `${htmlCache.current.scrollHeight + 20}px`;
    watermarkCache.current.style.left = `${htmlCache.current.scrollWidth + 20}px`;

    document.body.append(watermarkCache.current);
  });

  return <WatermarkStyles isOnPaidPlan={isOnPaidPlan} />;
};

export default ExportWatermark;
