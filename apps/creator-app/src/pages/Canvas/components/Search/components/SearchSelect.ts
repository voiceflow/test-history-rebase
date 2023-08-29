import { Animations } from '@voiceflow/ui';
import Select from 'react-select';

import { styled, transition } from '@/hocs/styled';

import { SearchOption } from '../types';

export const searchSelectFactory = <T>() => styled(Select<T, false>)`
  overflow: hidden;
  border-radius: 10px;
  box-shadow: inset rgb(0 0 0 / 50%) 0px -1px 0px 0px, rgb(0 0 0 / 16%) 0px 1px 3px 0px;
  animation: ${Animations.fadeInKeyframes} 0.15s ease, ${Animations.moveInTopKeyframes} 0.15s ease;
  transform-origin: top;
  background-color: #33373a;

  .search__placeholder {
    color: #f2f7f780;
  }
  .search__control {
    height: 52px;
    padding-left: 24px;
    font-size: 15px;
    border-radius: 10px;
    border: none;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
    background-color: transparent;
  }

  .search__value-container {
    padding: 0;
    cursor: text;
  }

  .search__input-container {
    color: #f2f7f7;
  }

  .search__menu-notice--no-options {
    color: #f2f7f780;
  }

  .search__menu {
    border-radius: 0;
    padding: 0px 8px;
    margin: 0px;
    position: static;
    box-shadow: inset rgb(0 0 0 / 50%) 0px -1px 0px 0px, rgb(0 0 0 / 16%) 0px 1px 3px 0px;
    background-color: transparent;
  }

  .search__menu-list {
    ${Animations.fadeInDownDelayedStyle}
    max-height: 355px;
    padding-top: 0;
    padding-bottom: 8px;
  }

  .search__option {
    border-radius: 6px;
    padding: 10px 16px;
    color: #f2f7f7;
    cursor: pointer;
    ${transition('background-color')}
  }

  .search__option--is-focused {
    background-color: #4b5052;
  }

  .search__option--is-focused:active {
    background-color: #4b5052;
  }
`;

const SearchSelect = searchSelectFactory<SearchOption>();

export default SearchSelect;
