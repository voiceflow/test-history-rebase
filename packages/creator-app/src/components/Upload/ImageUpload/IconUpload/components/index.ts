import { css, styled } from '@/hocs';

import RemoveButton from '../../components/RemoveButton';
import ErrorText from './ErrorText';
import IconUploadInput from './IconUploadInput';
import ImageContainer from './ImageContainer';

export { ErrorText, IconUploadInput, ImageContainer };

export const IconUploadContainer = styled.div<{ isActive?: boolean }>`
  :not(:hover) {
    ${RemoveButton} {
      display: none;
    }
  }
  ${({ isActive }) =>
    isActive &&
    css`
      outline: none;
    `}

  &:focus {
    outline: none;
  }
`;
