import { storiesOf } from '@storybook/react';
import React, { createElement, useRef, useState } from 'react';

import Variant from '@/../.storybook/Variant';

import Portal from '.';

storiesOf('Portal', module).add('variants', () =>
  createElement(() => {
    const customPortalNode = useRef();
    const [rendered, updateRendered] = useState(false);

    return (
      <>
        <Variant label="basic">
          <Portal>Portal content here</Portal>
        </Variant>
        <Variant label="custom portal node">
          <div
            ref={(node) => {
              customPortalNode.current = node;
              updateRendered(true);
            }}
          >
            {rendered && <Portal portalNode={customPortalNode.current}>Custom Portal content here</Portal>}
          </div>
        </Variant>
      </>
    );
  })
);
