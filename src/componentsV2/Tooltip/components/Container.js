import { styled, units } from '@/hocs';

const TooltipContainer = styled.div`
  width: 440px;
  max-height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: ${units(3)}px ${units(4)}px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  z-index: 20;
  color: #132144;
  font-weight: normal;
  font-size: 15px;
  line-height: 22px;

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
