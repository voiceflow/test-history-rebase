import cn from 'classnames';
import React from 'react';
import ReactSelect, { components } from 'react-select';

import { css, styled } from '@/hocs';
import { FadeDownDelay } from '@/styles/animations';

import { Option, SingleValueOption } from './components';

export { SingleValueOption, Option };

export { components };

const Select = ({ className, ...props }) => <ReactSelect className={cn('select-box', className)} classNamePrefix="select-box" {...props} />;

export default styled(Select)`
  ${({ fullWidth }) =>
    fullWidth
      ? css`
          width: 100%;
        `
      : css`
          min-width: 200px;
        `}

  & .select-box__menu-list {
    ${FadeDownDelay}
  }

  & .slot-label .fa-amazon {
    margin-top: 3px;
    font-size: 1.3em;
  }

  & .slot-label i {
    width: 100%;
    margin-right: 0.3em;
    color: #8da2b5;
  }
`;
