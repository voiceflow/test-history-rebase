import React from 'react';

import { EngineContext } from '@/containers/CanvasV2/contexts';

import BlockEditorInput from './BlockEditorInput';

const SAVE_TIMEOUT = 200;

function BlockEditorTitle({ name, onChange, disabled, renameActiveRevision }) {
  const inputRef = React.useRef();
  const titleSave = React.useRef();
  const engine = React.useContext(EngineContext);
  const updateTitle = React.useCallback(
    ({ target: { value } }) => {
      onChange({ name: value }, false);

      clearTimeout(titleSave.current);
      titleSave.current = setTimeout(() => engine.saveHistory(), SAVE_TIMEOUT);
    },
    [onChange]
  );

  React.useEffect(() => {
    if (renameActiveRevision) {
      inputRef.current.select();
    }
  }, [renameActiveRevision]);

  return <BlockEditorInput ref={inputRef} value={name} onChange={updateTitle} disabled={disabled} />;
}

export default BlockEditorTitle;
