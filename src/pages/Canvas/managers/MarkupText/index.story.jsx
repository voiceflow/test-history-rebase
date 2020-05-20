import React from 'react';

import { composeDecorators } from '@/../.storybook';

import { MarkupTextEditor } from './MarkupTextEditor';
import { Font, FontWeight } from './constants';

const withDecorators = composeDecorators((Component) => (
  <div style={{ width: '360px', maxHeight: '400px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
    <Component />
  </div>
));

export default {
  title: 'Creator/Editors/MarkupText',
  component: MarkupTextEditor,
  includeStories: [],
};

export const normal = withDecorators(() => {
  const [textData, setTextData] = React.useState({
    color: { r: 0, g: 0, b: 50, a: 0.7 },
    fontSize: 12,
    isItalic: false,
    fontFamily: Font.ARIAL,
    fontWeight: FontWeight.REGULAR,
  });
  const [blockData, setBlockData] = React.useState({});

  return <MarkupTextEditor textData={textData} blockData={blockData} onChangeBlockData={setBlockData} onChangeTextData={setTextData} />;
});
