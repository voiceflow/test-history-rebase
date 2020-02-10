import React from 'react';

import { useDebouncedCallback } from '@/hooks/callback';
import { EngineContext } from '@/pages/Canvas/contexts';

import BlockEditorInput from './BlockEditorInput';

function BlockEditorTitle({ name, onChange, disabled, renameActiveRevision }) {
  const engine = React.useContext(EngineContext);
  const inputRef = React.useRef();
  const [value, updateValue] = React.useState(name);

  const onChangeValue = useDebouncedCallback(
    300,
    (value) => {
      onChange({ name: value }, false);
      engine.saveHistory();
    },
    [engine, onChange]
  );

  const updateTitle = React.useCallback(
    ({ target: { value } }) => {
      updateValue(value);
      onChangeValue(value);
    },
    [onChangeValue]
  );

  React.useEffect(() => {
    if (renameActiveRevision) {
      inputRef.current.select();
    }
  }, [renameActiveRevision]);

  React.useEffect(() => {
    updateValue(name);
  }, [name]);

  return <BlockEditorInput ref={inputRef} value={value} onChange={updateTitle} disabled={disabled} />;
}

export default BlockEditorTitle;
