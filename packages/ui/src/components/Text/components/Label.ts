import { colors, styled } from '../../../styles';
import Text from './Text';

export const Label = styled(Text).attrs({ as: 'label' })`
  display: block;
  margin-bottom: 11px;
  color: ${colors('secondary')};
  font-weight: 600;
  font-size: 15px;
  line-height: 1.4666666667;
`;

export default Label;
