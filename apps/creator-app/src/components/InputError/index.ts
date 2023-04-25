import { color, ColorProps, space, SpaceProps, typography, TypographyProps } from 'styled-system';

import { styled } from '@/hocs/styled';

const InputError = styled.div<SpaceProps & ColorProps & TypographyProps>(
  // this makes it possible to override styles via styled props
  { color: '#BD425F', margin: '13px 0', fontSize: '13px' },
  space,
  color,
  typography
);

export default InputError;
