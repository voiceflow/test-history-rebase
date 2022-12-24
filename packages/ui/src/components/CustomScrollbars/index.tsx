import composeRef from '@seznam/compose-react-refs';
import React from 'react';
import { ScrollbarProps, Scrollbars as ReactScrollbars } from 'react-custom-scrollbars';

import * as S from './styles';
import * as T from './types';

export * as CustomScrollbarsTypes from './types';

const ScrollbarsContext = React.createContext<React.RefObject<T.Scrollbars | null>>({ current: null });

const CustomScrollbars = (props: ScrollbarProps, ref: React.Ref<T.Scrollbars>) => {
  const scrollbarsRef = React.useRef<T.Scrollbars>(null);

  return (
    <ScrollbarsContext.Provider value={scrollbarsRef}>
      <ReactScrollbars
        ref={composeRef(ref, scrollbarsRef)}
        autoHide
        renderThumbVertical={(props: any) => <S.ThumbVertical {...props} />}
        renderTrackVertical={(props: any) => <S.TrackVertical {...props} />}
        {...props}
      />
    </ScrollbarsContext.Provider>
  );
};

export const useScrollbars = () => React.useContext(ScrollbarsContext);

export default Object.assign(React.forwardRef(CustomScrollbars), { useScrollbars });
