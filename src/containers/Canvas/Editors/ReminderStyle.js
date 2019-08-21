import Toggle from 'react-toggle';
import { Button, ButtonGroup } from 'reactstrap';
import styled from 'styled-components';

export const RecurrenceDayBtn = styled(Button)`
  background: ${(props) => (props.selected ? 'auto' : 'white')};
  :hover {
    background: auto;
  }
`;

export const RecurrenceDayContainer = styled(ButtonGroup)`
  width: 100;
`;

export const RecurrenceToggle = styled(Toggle)`
  float: right;
  margin: 10px 0px;
`;
