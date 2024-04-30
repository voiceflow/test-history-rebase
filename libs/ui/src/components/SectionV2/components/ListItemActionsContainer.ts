import { css, styled, units } from '@/styles';

import ActionsContainer from './ActionsContainer';

const ListItemActionContainer = styled(ActionsContainer).attrs({ unit: 0, offsetUnit: 2 })<{ isCentred?: boolean }>`
  ${({ isCentred }) =>
    !isCentred &&
    css`
      margin-top: ${units(1.25)}px;
      align-self: flex-start;
    `};
`;

export default ListItemActionContainer;
