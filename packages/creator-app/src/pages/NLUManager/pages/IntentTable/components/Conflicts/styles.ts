import { SectionV2, transition } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const IntentsGrid = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1px;
  width: 100%;
  border-top: 1px solid #eaeff4;

  &:first-child {
    border-top: none;
  }

  ${SectionV2.ListItemContent} {
    overflow: visible;
  }
`;

export const IntentItem = styled.div`
  background-color: white;
  padding: 20px 32px 24px 32px;
  border-top: solid 1px #eaeff4;

  &:first-child {
    border-top: none;
  }
`;

export const DragIconContainer = styled.div`
  ${transition('opacity')};
  position: absolute;
  left: -5px;
  bottom: 14px;
  opacity: 0;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #eaeff4;
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 24px 0;
  z-index: 99;
  background-color: #fbfbfb;
  height: 100%;
`;

export const UtteranceListItemContainer = styled.div<{ isDragging?: boolean }>`
  &:hover {
    ${DragIconContainer} {
      opacity: 1;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }
  }

  ${({ isDragging }) =>
    isDragging
      ? css`
           {
            opacity: 0;
          }
        `
      : css`
           {
            position: relative;
          }
        `};
`;

export const Utterance = styled.div<{ isDragging: boolean; isDraggingPreview: boolean }>`
  ${transition('background', 'opacity', 'background-image', 'box-shadow')};

  border-radius: 5px;
  box-shadow: 0 0 3px 0 rgba(17, 49, 96, 0.06);
  border: solid 1px #d4d9e6;
  background-color: white;
  padding: 8px 48px 7px 16px;
  width: 100%;
  cursor: text;

  ${({ isDraggingPreview }) =>
    isDraggingPreview &&
    css`
      box-shadow: 0 4px 8px 0 rgba(17, 49, 96, 0.08), 0 0 0 1px rgba(17, 49, 96, 0.08);
      background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.6)), linear-gradient(to bottom, white, white);
      border: none;
      transform: rotate(-1deg);
      margin: 8px;
      cursor: grabbing;
    `};
`;

export const ContentContainer = styled.div`
  padding-right: 32px;
  padding-left: 32px;
`;
