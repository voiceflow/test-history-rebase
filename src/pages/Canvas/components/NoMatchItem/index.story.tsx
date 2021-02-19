import { withRedux } from '_storybook';
import { action } from '@storybook/addon-actions';
import React from 'react';

import { DialogType, PlatformType } from '@/constants';

import NoMatchItem from '.';

export const ssml = () =>
  withRedux()(() => {
    const ref = React.useRef(42);

    return (
      <>
        <NoMatchItem
          index={0}
          item={{
            id: 'dummy',
            type: DialogType.VOICE,
            voice: 'Alexa',
            content: 'Hello, world!',
          }}
          onUpdate={action('onUpdate called')}
          platform={PlatformType.ALEXA}
          isOnlyItem={true}
          isDragging={false}
          isRandomized={false}
          onContextMenu={() => alert('onContextMenu()')}
          itemKey={1}
          latestCreatedKey={ref}
          connectedDragRef={null}
          isDraggingPreview={false}
          isContextMenuOpen={false}
          header="Header"
        />
      </>
    );
  });

export const audio = withRedux()(() => {
  const ref = React.useRef(42);

  return (
    <>
      <NoMatchItem
        index={1}
        item={{
          id: 'dummy',
          type: DialogType.AUDIO,
          url: 'It Is So [A-One]',
        }}
        onUpdate={action('onUpdat called')}
        platform={PlatformType.ALEXA}
        isOnlyItem={true}
        isDragging={false}
        isRandomized={true}
        onContextMenu={action('onContextMenu called')}
        itemKey={1}
        latestCreatedKey={ref}
        connectedDragRef={null}
        isDraggingPreview={false}
        isContextMenuOpen={false}
        header="Header"
      />
    </>
  );
});
