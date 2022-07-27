import { SectionV2, transition } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export const IntentsGrid = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid #eaeff4;
  grid-gap: 1px;
  width: 100%;

  ${SectionV2.ListItemContent} {
    overflow: visible;
  }
`;

export const IntentItem = styled.div`
  background-color: white;
  min-height: 172px;
  padding: 20px 32px 24px 32px;
  border-top: solid 1px #eaeff4;

  &:first-child {
    border-top: none;
  }
`;

export const DragIconContainer = styled.div`
  position: absolute;
  left: -5px;
  bottom: 14px;
  display: none;
`;

export const UtteranceListItemContainer = styled.div<{ isDragging: boolean }>`
  &:hover {
    ${DragIconContainer} {
      display: block;
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
