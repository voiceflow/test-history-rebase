import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';

import TitleInput from './TitleInput';

type TitleProps = {
  name: string;
  onChange: (value: string) => void;
  renameRevision: string;
};

const Title: React.FC<TitleProps> = ({ name, onChange, renameRevision }) => {
  const inputRef = React.useRef<HTMLInputElement>();
  const [value, setValue] = React.useState(name);
  const engine = React.useContext(EngineContext)!;

  const onBlur = () => {
    onChange(value);
    engine.saveHistory();
  };

  React.useEffect(() => {
    setValue(name);
  }, [name]);

  React.useEffect(() => {
    if (renameRevision) {
      inputRef.current?.select();
    }
  }, [renameRevision]);

  return (
    <TitleInput ref={inputRef} value={value} onBlur={onBlur} onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => setValue(target.value)} />
  );
};

export default Title;
