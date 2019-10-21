import { ListManagerContainer } from '@/components/ListManager';
import { cardStyles } from '@/componentsV2/Card';
// eslint-disable-next-line no-secrets/no-secrets
import RemovableSection from '@/containers/CanvasV2/components/BlockEditor/components/BlockEditorRemovableSection';
import { styled } from '@/hocs';

const CardManagerItem = styled(RemovableSection)`
  ${cardStyles}

  border: 0;
  margin: ${({ theme }) => theme.unit}px 0;
  box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.06), 0 2px 4px 0 rgba(17, 49, 96, 0.12);

  && {
    padding: ${({ theme }) => `${theme.unit * 1.5}px ${theme.unit * 2}px`};
  }

  & > * {
    margin-bottom: 0;
  }

  & .name-input {
    border: 0;

    &:focus {
      outline: 0;
    }
  }

  & .collapse-indicator {
    width: 30px;
    margin-left: -10px;
    color: #8da2b5;
    line-height: 16px;
    text-align: center;
    cursor: pointer;
  }

  & ${ListManagerContainer} {
    padding-top: ${({ theme }) => theme.unit}px;
  }
`;

export default CardManagerItem;
