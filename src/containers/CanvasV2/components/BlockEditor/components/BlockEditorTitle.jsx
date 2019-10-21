import React from 'react';

import BlockEditorInput from './BlockEditorInput';

function BlockEditorTitle({ name, onChange, disabled, renameActiveRevision }) {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (renameActiveRevision) {
      inputRef.current.select();
    }
  }, [renameActiveRevision]);

  return <BlockEditorInput ref={inputRef} value={name} onChange={({ target: { value } }) => onChange({ name: value })} disabled={disabled} />;
}

export default BlockEditorTitle;
