import { flexStyles } from '@/components/Flex';
import { styled } from '@/hocs';

const PanelSection = styled.section`
  ${flexStyles}

  flex-direction: column;
  padding: ${({ theme }) => `${theme.unit}px ${theme.unit * 3}px`};

  & > * {
    margin-bottom: ${({ theme }) => theme.unit}px;
    width: 100%;
    box-sizing: border-box;
  }

  & > :last-child {
    margin-bottom: 0;
  }

  /* & .section-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    padding-top: 5px;
    color: #697e92;
    font-weight: 600;
    font-size: 13px;
    text-transform: capitalize;
    border-radius: 5px;
  } */
`;

export default PanelSection;
