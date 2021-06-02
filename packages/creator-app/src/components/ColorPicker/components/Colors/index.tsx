import React from 'react';

import { Container, Item, List } from './components';

const COLORS = ['#fff', '#132042', '#4F9ED1', '#4FA9B3', '#A086C4', '#E26D5A', '#BF395B', '#5C6BC0', '#3A5999', '#457A53', '#3A7685', '#BF9677'];

type ColorsProps = {
  onSelect: (color: string) => void;
};

const Colors: React.FC<ColorsProps> = ({ onSelect }) => (
  <Container>
    <List>
      {COLORS.map((color) => (
        <Item key={color} style={{ backgroundColor: color }} onClick={() => onSelect(color)} />
      ))}
    </List>
  </Container>
);

export default Colors;
