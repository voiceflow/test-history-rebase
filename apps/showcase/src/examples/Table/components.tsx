import { faker } from '@faker-js/faker';
import { CellContext } from '@tanstack/react-table';
import { Input, OverflowTippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { TableItem } from './types';

export const ImageColumn: React.FC<{ url: string; context: CellContext<TableItem, string> }> = ({ url }) => {
  const padding = faker.datatype.boolean() ? '10px' : '15px';

  return (
    <div style={{ paddingTop: padding }}>
      <img src={url} alt="test" style={{ width: '30px', height: '30px' }} />
    </div>
  );
};

export const NameColumn: React.FC<{ name: string }> = ({ name }) => {
  const [value, setValue] = React.useState(name);

  return <Input value={value} onChangeText={setValue} />;
};

export const ImageTooltipColumn: React.FC<{ url: string }> = ({ url }) => {
  return (
    <OverflowTippyTooltip<HTMLImageElement> overflow content={<div>tooltip</div>}>
      {(ref) => <img ref={ref} src={url} alt="test" style={{ width: '30px', height: '30px' }} />}
    </OverflowTippyTooltip>
  );
};

export const NameTooltipColumn: React.FC<{ name: string }> = ({ name }) => {
  const [value, setValue] = React.useState(name);

  return (
    <OverflowTippyTooltip<HTMLInputElement> overflow content={<div>tooltip</div>}>
      {(ref) => <Input ref={ref} value={value} onChangeText={setValue} />}
    </OverflowTippyTooltip>
  );
};

export const IdTooltipColumn: React.FC<{ id: string }> = ({ id }) => {
  return (
    <OverflowTippyTooltip<HTMLInputElement> overflow content={<div>tooltip</div>}>
      {(ref) => <div ref={ref}>{id}</div>}
    </OverflowTippyTooltip>
  );
};

export const IdColumn: React.FC<{ id: string }> = ({ id }) => {
  return <div>{id}</div>;
};
