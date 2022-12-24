import DayPicker from 'react-day-picker';

import { css, styled } from '@/hocs/styled';
import THEME from '@/styles/theme';

import leftArrow from './leftArrow.png';
import rightArrow from './rightArrow.png';

export const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const FORMAT = 'MM/DD/YYYY';

export const TimeRangePicker = styled(DayPicker)<{ isConversation?: boolean; isRangeSelected?: boolean }>`
  & .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--outside):not(.DayPicker-Day--end) {
    background-color: ${THEME.backgrounds.lightBlue};
    color: ${THEME.colors.primary};
    border-radius: 0;
  }

  & .DayPicker-Day {
    border-radius: 0;
    font-size: 13px;
    font-family: Open Sans;
    padding: 12px 14px;

    &:hover {
      border-radius: 50%;
    }
  }

  & .DayPicker-Day--start:not(.DayPicker-Day--outside) {
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

  & .DayPicker-Day--outside {
    cursor: pointer;
  }

  & .DayPicker-Day--end:not(.DayPicker-Day--outside) {
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

  & .DayPicker-Weekday {
    padding: 9px;
  }

  & .DayPicker-Day--sundays {
    ${({ isRangeSelected }) =>
      isRangeSelected &&
      css`
        border-start-start-radius: 50% !important;
        border-end-start-radius: 50% !important;
      `};
  }

  & .DayPicker-Day--saturdays {
    ${({ isRangeSelected }) =>
      isRangeSelected &&
      css`
        border-start-end-radius: 50% !important;
        border-end-end-radius: 50% !important;
      `}
  }

  & .DayPicker-Weekdays {
    font-size: 13x;
    padding-left: 10px;
    font-family: Open Sans;
    & > * > * {
      padding-right: 26px;
    }
  }

  & .DayPicker--selected {
     border-radius: 0 !important;
  }

  & .DayPicker-Day--today {
    background-color: ${THEME.backgrounds.greyGreen};
    color: ${THEME.colors.primary};
    border-radius: 50%;
  }

  & .DayPicker-Months {
    font-size: 13px;
    font-family: Open Sans;

    & .DayPicker-Month {
      & > * {
        display: table-caption;
        text-align: center;
      }
    }
  }

  ${({ isConversation }) =>
    isConversation
      ? css`
          & .DayPicker-NavBar {
            & > .DayPicker-NavButton--prev {
              margin: -1px 590px 0px 0px;
              background-image: url(${leftArrow});
            }

            & > .DayPicker-NavButton--next {
              margin-top: -1px;
              margin-right: 12px;
              background-image: url(${rightArrow});
            }
          }
        `
      : css`
          & .DayPicker-NavBar {
            & > .DayPicker-NavButton--prev {
              margin: -1px 265px 0px 0px;
              background-image: url(${leftArrow});
            }

            & > .DayPicker-NavButton--next {
              margin-top: -1px;
              margin-right: 10px;
              background-image: url(${rightArrow});
            }
          }
        `};
  }
`;

export const DayPickerContainer = styled.div`
  & * {
    outline: none !important;
  }
`;
