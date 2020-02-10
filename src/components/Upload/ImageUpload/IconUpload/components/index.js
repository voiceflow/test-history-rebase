import { css, styled } from '@/hocs';

import ErrorText from './ErrorText';
import IconUploadInput from './IconUploadInput';
import ImageContainer from './ImageContainer';

export { ErrorText, IconUploadInput, ImageContainer };

export const IconUploadContainer = styled.div`
  ${({ isActive }) =>
    isActive &&
    css`
      outline: none;
    `}

  &:focus {
    outline: none;
  }
`;
