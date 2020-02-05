import { textEditorContentAdapter } from '@/client/adapters/textEditor';

import { createBlockAdapter } from './utils';

const streamBlockAdapter = createBlockAdapter(
  ({ audio, title, description, icon_img, background_img, custom_pause, loop }) => ({
    audio,
    title: textEditorContentAdapter.fromDB(title),
    description: textEditorContentAdapter.fromDB(description),
    iconImage: icon_img || null,
    backgroundImage: background_img || null,
    customPause: custom_pause,
    loop,
  }),
  ({ audio, title, description, iconImage, backgroundImage, customPause, loop }) => ({
    audio,
    title: textEditorContentAdapter.toDB(title),
    description: textEditorContentAdapter.toDB(description),
    icon_img: iconImage,
    background_img: backgroundImage,
    custom_pause: customPause,
    loop,
  })
);

export default streamBlockAdapter;
