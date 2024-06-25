import { styled } from '@ui/styles';
import { fontResetStyle } from '@ui/styles/bootstrap';
import React from 'react';

const TRACK_HEIGHT = 12;

export const RangeContainer = styled.section`
  width: 164px;
  position: relative;
  display: flex;
  margin-left: -3px;
`;

export const RangeSlider = styled.input.attrs({
  type: 'range',
})`
  ${fontResetStyle};

  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  z-index: 1;
  width: 100%;
  border: none;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    margin-top: -6px;
    border: 7px solid #fdfdfd;
    border-radius: 50%;
    height: 24px;
    width: 24px;
    box-shadow:
      0 1px 3px 0 rgba(17, 49, 96, 0.12),
      0 0 0 1px rgba(17, 49, 96, 0.06);
  }

  &::-moz-range-thumb {
    border: 7px solid #fdfdfd;
    border-radius: 50%;
    height: 10px;
    width: 10px;
    appearance: none;
    background-color: transparent;
    box-shadow:
      0 1px 3px 0 rgba(17, 49, 96, 0.12),
      0 0 0 1px rgba(17, 49, 96, 0.06);
  }

  &::-moz-range-track {
    height: ${TRACK_HEIGHT}px;
    width: 100%;
  }
  &::-webkit-slider-runnable-track {
    height: ${TRACK_HEIGHT}px;
    width: 100%;
  }
`;

export const RangeTrack = styled.span`
  /*
    So far it is not possible to make the very center of the slider thumb touch the edge of the track.
    Instead, the edge of the thumb touches the edge of the track on either side.
    Hence, we make the track invisible and this component simulates the track with some invisible margins.
  */

  width: calc(100% - 7px);
  height: 100%;
  left: 50%;
  top: 50%;
  height: ${TRACK_HEIGHT}px;
  transform: translate(-50%, -50%);
  position: absolute;
  background: linear-gradient(
    to right,
    rgb(255, 48, 118),
    rgb(243, 79, 0),
    rgb(200, 116, 0),
    rgb(174, 129, 0),
    rgb(153, 137, 0),
    rgb(129, 144, 0),
    rgb(94, 152, 0),
    rgb(0, 158, 58),
    rgb(0, 155, 110),
    rgb(0, 154, 133),
    rgb(0, 152, 150),
    rgb(0, 150, 166),
    rgb(0, 148, 187),
    rgb(0, 142, 225),
    rgb(117, 121, 255),
    rgb(185, 89, 255),
    rgb(236, 0, 250),
    rgb(248, 0, 210),
    rgb(255, 21, 170),
    rgb(255, 48, 118)
  );
  border-radius: ${TRACK_HEIGHT}px;
  z-index: 0;
`;

export const Range: React.FC<{ [key: string]: unknown }> = (props): React.ReactElement => (
  <RangeContainer>
    <RangeSlider {...props} />
    <RangeTrack />
  </RangeContainer>
);
