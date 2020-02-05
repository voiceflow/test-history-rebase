import React from 'react';

import { EngineContext } from '@/containers/CanvasV2/contexts';

import { TitleInput } from './styled';

export default function EditorHeaderTitle({ name, onChange, renameRevision }) {
  const inputRef = React.useRef();
  const [value, setValue] = React.useState(name);
  const engine = React.useContext(EngineContext);

  const onBlur = () => {
    onChange(value);
    engine.saveHistory();
  };

  React.useEffect(() => {
    setValue(name);
  }, [name]);

  React.useEffect(() => {
    if (renameRevision) {
      inputRef.current.select();
    }
  }, [renameRevision]);

  return <TitleInput ref={inputRef} value={value} onBlur={onBlur} onChange={({ target }) => setValue(target.value)} />;
}
