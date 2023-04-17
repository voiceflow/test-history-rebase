import 'react-day-picker/dist/style.css';

import { DayPicker } from 'react-day-picker';

import { css, styled } from '@/hocs/styled';
import THEME from '@/styles/theme';

import leftArrow from './leftArrow.png';
import rightArrow from './rightArrow.png';

export const FORMAT = 'MM/DD/YYYY';

export const TimeRangePicker = styled(DayPicker)<{ isRangeSelected?: boolean }>`
  & .rdp-day_selected:not(.rdp-day_range_start):not(.rdp-day_outside):not(.rdp-day_range_end) {
    background-color: ${THEME.backgrounds.lightBlue};
    color: ${THEME.colors.primary};
    border-radius: 50% !important;
  }

  & .rdp-day {
    border-radius: 50%;
    font-size: 13px;
    font-family: Open Sans;
    padding: 12px 14px;

    &:hover {
      border-radius: 50%;
    }
  }

  & .rdp-day_range_start:not(.rdp-day_outside) {
    border-radius: 50% !important;
    position: relative;

    &:after {
      ${({ isRangeSelected }) =>
        isRangeSelected &&
        css`
          content: '';
          position: absolute;
          background-color: ${THEME.backgrounds.lightBlue};
          width: 50%;
          height: 100%;
          right: 0;
          top: 0;
          z-index: -1;
        `}
    }
  }

  & .rdp-day_outside {
    cursor: pointer;
  }

  & .rdp-day_range_end:not(.rdp-day_outside) {
    border-radius: 50% !important;
    position: relative;

    &:before {
      ${({ isRangeSelected }) =>
        isRangeSelected &&
        css`
          content: '';
          position: absolute;
          background-color: ${THEME.backgrounds.lightBlue};
          width: 50%;
          height: 100%;
          left: 0;
          top: 0;
          z-index: -1;
        `}
    }
  }

  & .rdp-head_row {
    font-size: 13x;
    padding-left: 10px;
    font-family: Open Sans;
  }

  & .rdp-head_cell {
    padding: 9px;
  }

  & .rdp-day_selected {
    border-radius: 0 !important;
  }

  & .rdp-day_today:not(.rdp-day_outside) {
    background-color: ${THEME.backgrounds.greyGreen};
    color: ${THEME.colors.primary};
    border-radius: 50%;
  }

  & .rdp-months {
    font-size: 13px;
    font-family: Open Sans;
  }

  & .rdp-caption_label {
    text-align: center;
  }

  & .rdp-nav {
    .rdp-nav_button_previous {
      background-image: url(${leftArrow});
      background-size: 40%;
      background-repeat: no-repeat;
      background-position: center;

      svg {
        display: none;
      }
    }

    .rdp-nav_button_next {
      background-image: url(${rightArrow});
      background-size: 40%;
      background-repeat: no-repeat;
      background-position: center;

      svg {
        display: none;
      }
    }
  }
`;

export const DayPickerContainer = styled.div`
  & * {
    outline: none !important;
  }
`;
