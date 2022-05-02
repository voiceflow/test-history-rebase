import composeRef from '@seznam/compose-react-refs';
import React from 'react';
import { ScrollbarProps, Scrollbars as ReactScrollbars } from 'react-custom-scrollbars';

import { ThumbVertical, TrackVertical } from './components';

export interface Scrollbars extends ReactScrollbars {
  view: HTMLDivElement;
}

const ScrollbarsContext = React.createContext<React.RefObject<Scrollbars | null>>({ current: null });

const CustomScrollbars = (props: ScrollbarProps, ref: React.Ref<Scrollbars>) => {
  const scrollbarsRef = React.useRef<Scrollbars>(null);

  return (
    <ScrollbarsContext.Provider value={scrollbarsRef}>
      <ReactScrollbars
        ref={composeRef(ref, scrollbarsRef)}
        autoHide
        renderThumbVertical={(props: any) => <ThumbVertical {...props} />}
        renderTrackVertical={(props: any) => <TrackVertical {...props} />}
        {...props}
      />
    </ScrollbarsContext.Provider>
  );
};

export const useScrollbars = () => React.useContext(ScrollbarsContext);

export default React.forwardRef(CustomScrollbars);
