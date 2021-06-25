import { styled } from '@/hocs';

const DiagramDivider = styled.div`
  font-size: 16px;
  color: #becedc;
  margin-right: 12px;

  &:before {
    content: '/';
  }
`;

export default DiagramDivider;
