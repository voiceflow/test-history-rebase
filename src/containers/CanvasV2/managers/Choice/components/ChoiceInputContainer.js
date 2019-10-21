import { styled } from '@/hocs';

const ChoiceInputComponent = styled.div`
  & .choice-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
  }

  & .choice-utterance {
    display: flex;
    border-bottom: 1px solid #e9eef3;
    padding: 3px 0;
    color: #8da2b5;

    &:last-child {
      border-bottom: 0;
    }
  }

  & .section-title {
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    margin-bottom: 5px;
    padding-top: 5px;
    color: #697e92;
    font-weight: 600;
    font-size: 13px;
    text-transform: capitalize;
  }

  & .trash-icon {
    padding: 5px 4px 0 5px;
    color: #ccd5dc;
    cursor: pointer;

    &:hover {
      color: #8da2b5;
    }
  }
`;

export default ChoiceInputComponent;
