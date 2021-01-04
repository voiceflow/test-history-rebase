import { styled, units } from '@/hocs';

const FrameTitle = styled.div`
  position: absolute;
  left: 0;
  bottom: calc(100% + ${units()}px);
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.secondary};

  > span {
    margin-left: ${units()}px;
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

export default FrameTitle;
