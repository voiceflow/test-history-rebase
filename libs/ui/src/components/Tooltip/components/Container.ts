import { styled, units } from '@/styles';

const TooltipContainer = styled.div`
  overflow-y: auto;
  padding: ${units(3)}px ${units(4)}px;

  b {
    color: #132144;
    font-weight: 600;
  }

  ol,
  ul {
    margin: 0;
    color: #62778c;
  }

  h5 {
    font-size: 15px;
    font-weight: 600;
  }

  em {
    color: #4e6ff9;
    font-style: normal;
  }

  var {
    font-weight: 600;
    color: #132144;
    font-style: normal;

    &:before {
      content: '{';
    }
    &:after {
      content: '}';
    }
  }

  dl {
    margin-left: ${units(2)}px;
  }

  dt {
    color: #132144;
    font-weight: 600;
  }

  dd {
    font-size: 13px;
    color: #62778c;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default TooltipContainer;
