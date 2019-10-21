import { styled } from '@/hocs';

const SubSection = styled.div`
  width: ${({ size }) => size};

  & > * {
    margin-bottom: 14px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

SubSection.defaultProps = {
  size: '100%',
};

export default SubSection;
