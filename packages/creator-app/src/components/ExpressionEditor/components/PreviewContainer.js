import { styled } from '@/hocs';

const PreviewContainer = styled.div`
  border: ${({ noBorder }) => (noBorder ? 'none' : '1px dashed #d4d9e6')};
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 5px 8px;
  line-height: 28px;
  text-align: left;
  color: #132144;

  & .brackets {
    & > .variable {
      border-radius: 5px;
      padding: 2px 5px 4px 5px;
      color: #fff;
      font-size: 14px;
      background: linear-gradient(180deg, rgba(78, 111, 249, 100) 0%, #3153e4 100%);
    }

    & > .NaN {
      border-radius: 5px;
      padding: 2px 4px 4px 4px;
      color: #2b3950;
      background-color: #e3e9ec;
      cursor: pointer;
    }

    & > .NaN::after {
      content: 'NaN';
    }

    & > .NaN:hover::after {
      content: 'Not a Number';
    }

    & > .or {
      color: #03a9f4;
    }

    & > .and {
      color: #ffa726;
    }

    & > .not {
      color: #ef5350;
    }

    & > .unknown {
      color: #496cf6;
      font-weight: bold;
    }

    .parenthesis {
      color: #8da2b5;
    }
  }
`;

export default PreviewContainer;
