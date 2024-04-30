import { styled, transition } from '@/styles';

export const ThumbVertical = styled.div`
  border-radius: 1.5px;
  background-color: #dfe3ed;
  cursor: pointer;

  ${transition('background-color')}

  &:hover {
    background-color: #becedc;
  }
`;

export const TrackVertical = styled.div`
  width: 3px !important;
  top: 0;
  right: 6px;
  bottom: 0;
`;
