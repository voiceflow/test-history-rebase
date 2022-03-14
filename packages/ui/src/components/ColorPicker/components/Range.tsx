import React from 'react';
import styled from 'styled-components';

const TRACK_HEIGHT = 12;

export const RangeContainer = styled.section`
  width: 178px;
  position: relative;
  display: flex;
`;

export const RangeSlider = styled.input.attrs({
  type: 'range',
})`
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  z-index: 1;
  width: 100%;

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
    box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.12), 0 0 0 1px rgba(17, 49, 96, 0.06);
  }

  &::-moz-range-thumb {
    border: 7px solid #fdfdfd;
    border-radius: 50%;
    height: 10px;
    width: 10px;
    appearance: none;
    background-color: transparent;
    box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.12), 0 0 0 1px rgba(17, 49, 96, 0.06);
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

  width: calc(100% - 14px);
  height: 100%;
  left: 50%;
  top: 50%;
  height: ${TRACK_HEIGHT}px;
  transform: translate(-50%, -50%);
  position: absolute;
  background: linear-gradient(
    90deg,
    #eb450c 0%,
    #da471b 7%,
    #cd7d28 16%,
    #bcd333 24%,
    #63da3e 32%,
    #20e074 40%,
    #4fe1df 49%,
    #5893e4 56%,
    #3682e6 65%,
    #293de8 71%,
    #602bea 79%,
    #bc2eed 86%,
    #f6309d 93%,
    #ff3232 100%
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
