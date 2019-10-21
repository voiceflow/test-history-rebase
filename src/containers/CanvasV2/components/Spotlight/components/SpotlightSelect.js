import Select from 'react-select';

import { styled } from '@/hocs';
import { FadeDownDelay } from '@/styles/animations';

const SpotlightSelect = styled(Select)`
  .spotlight__placeholder {
    color: #8da2b5;
  }
  .spotlight__control {
    height: 60px;
    padding-left: 50px;
    color: #132144;
    font-size: 20px;
    background-image: url('/search.svg');
    background-repeat: no-repeat;
    background-position: 22px;
    background-size: 20px;
    border-radius: 6px;
    box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
    animation: fadein 0.15s ease, movein 0.15s ease;
    transform-origin: top;
    border: none;
  }

  .spotlight__menu-notice--no-options {
    color: #8da2b5;
  }
  .spotlight__menu {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  }
  .spotlight__menu-list {
    ${FadeDownDelay}
    overflow: hidden;
    max-height: 195px;
  }
  .spotlight__indicator-separator {
    color: #fff;
    background-color: #fff;
  }
  .spotlight__dropdown-indicator {
    margin-right: 20px;
    color: #8da2b5;
  }
  .spotlight__option {
    background-color: #fff;
  }
  .spotlight__option--is-focused {
    background-color: #f7f9fb;
  }
`;

export default SpotlightSelect;
