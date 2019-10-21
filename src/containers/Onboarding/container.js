import { styled, transition } from '@/hocs';

// eslint-disable-next-line import/prefer-default-export
export const ButtonCard = styled.div`
  min-width: 180px;
  min-height: 150px;
  padding: 21px 32px 4px 32px;
  border-radius: 5px;
  cursor: pointer;
  ${transition()}

  &:hover {
    box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  }

  img {
    margin: 0 7px 18px;
    height: 65px;
  }
`;
