import React from 'react';

import { Item, Section } from './components';

function ExpandingList({ expanded, onToggle, sections, itemComponent: ItemComponent }) {
  return (
    <>
      {sections.map(({ key, label, color, items }) => (
        <Section isExpanded={expanded.includes(key)} onToggle={() => onToggle(key)} label={label} color={color} key={key}>
          {items.map((item) => (
            <Item key={item.key}>
              <ItemComponent value={item} />
            </Item>
          ))}
        </Section>
      ))}
    </>
  );
}

export default ExpandingList;
