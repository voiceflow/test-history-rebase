import { flexApartStyles, flexLabelStyles, flexStyles } from '@/componentsV2/Flex';
import Input from '@/componentsV2/Input';
import { styled, transition, units } from '@/hocs';

import { HEADER_HEIGHT, HEADER_HEIGHT_WITH_NAME, sectionStyles } from '../../../styles';

export const Wrapper = styled.div.attrs({ column: true })`
  ${flexApartStyles}
  ${sectionStyles}

  height: ${({ withTitle }) => (withTitle ? HEADER_HEIGHT_WITH_NAME : HEADER_HEIGHT)}px;
  padding-top: ${units(2.5)}px;
  padding-bottom: ${units(2.5)}px;
  border-bottom: 1px solid #dfe3ed;
  background-color: #fff;
  z-index: 1;
`;

export const Breadcrumbs = styled.div.attrs({ fullWidth: true })`
  ${flexStyles}
  text-transform: capitalize;
  margin-bottom: 5px;
`;

export const Label = styled.a.attrs({ href: '' })`
  ${flexLabelStyles}
  ${transition('color')}
  color: #5d9df5;
  overflow: hidden;

  &:hover {
    color: #4986da;
  }

  &:active {
    color: #4986da;
  }
`;

export const ActiveLabel = styled.span`
  ${flexLabelStyles}
  ${transition('color')}
  color: #5d9df5;
  cursor: default;
`;

export const Divider = styled.span`
  margin: 0 8px;
  color: #8da2b5;
`;

export const TitleInput = styled(Input).attrs({ variant: 'inline' })`
  ${flexLabelStyles}
  font-size: 22px;
  font-weight: 600;
  color: #132144;
  width: 100%;
  flex: 1;
  margin-right: ${units(2)}px;
`;

export const TitleActionsWrapper = styled.div.attrs({ fullWidth: true })`
  ${flexApartStyles}
`;
