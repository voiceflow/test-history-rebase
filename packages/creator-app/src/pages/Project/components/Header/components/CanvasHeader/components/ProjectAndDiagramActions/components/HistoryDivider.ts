import { styled } from '@/hocs';

const HistoryDivider = styled.div`
  font-size: 16px;
  color: #becedc;

  &:before {
    content: '/';
  }
`;

export default HistoryDivider;
