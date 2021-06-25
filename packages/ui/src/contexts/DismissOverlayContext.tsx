import React from 'react';

import { withContext } from '../hocs/withContext';
import { useContextApi } from '../hooks/cache';
import { withoutValue } from '../utils/array';

type Handler = () => void;
type MouseEventHandler = (event: Event) => void;

export type DismissEventType = 'click' | 'mousedown';

class Subscriber {
  private handlers: MouseEventHandler[] = [];

  private handlersMap = new Map<MouseEventHandler, MouseEventHandler>();

  private childrenSubscriber: Subscriber | null = null;

  constructor(private rootNode: HTMLElement | Document) {}

  subscribe = (event: DismissEventType, handler: MouseEventHandler) => {
    this.handlers.push(handler);

    this.handlersMap.set(handler, (event) => {
      const lastHandler = this.handlers[this.handlers.length - 1];

      // call handler only if it is the deepest and the last
      if (lastHandler === handler && !this.childrenSubscriber?.hasHandlers()) {
        handler(event);
      }
    });

    this.rootNode.addEventListener(event, this.handlersMap.get(handler)!);
  };

  unsubscribe = (event: DismissEventType, handler: MouseEventHandler) => {
    this.rootNode.removeEventListener(event, this.handlersMap.get(handler)!);
    this.handlers = withoutValue(this.handlers, handler);
    this.handlersMap.delete(handler);
  };

  protected hasHandlers(): boolean {
    return !!this.childrenSubscriber?.hasHandlers() || this.handlers.length > 0;
  }

  setChildrenSubscriber(subscriber: Subscriber | null) {
    this.childrenSubscriber = subscriber;
  }
}

export type DismissOverlayValue<T extends HTMLElement | Document = Document> = {
  /**
   * root node of the current context
   */
  rootNode: T;

  subscriber: Subscriber;

  /**
   * dismiss all in the current context
   */
  dismissAll: () => void;
  /**
   * add handler to the current context
   */
  addHandler: (handler: Handler) => void;
  /**
   * dismiss last in the current context
   */
  dismissLast: () => void;
  /**
   * has handlers in the current context
   */
  hasHandlers: () => boolean;
  /**
   * remove handler to the current context
   */
  removeHandler: (handler: Handler) => void;
  /**
   * dismiss all in the all contexts
   */
  dismissAllGlobally: () => void;
  /**
   * has handlers the in any context
   */
  hasHandlersGlobally: () => boolean;
};

export const DismissOverlayContext = React.createContext<DismissOverlayValue<HTMLElement | Document> | null>(null);

export const { Consumer: DismissOverlayConsumer } = DismissOverlayContext;

let GLOBAL_OVERLAYS: Pick<DismissOverlayValue<any>, 'dismissAll' | 'hasHandlers'>[] = [];

const dismissAllGlobally = () => GLOBAL_OVERLAYS.forEach((globalOverlay) => globalOverlay.dismissAll());

const hasHandlersGlobally = () => GLOBAL_OVERLAYS.some((globalOverlay) => globalOverlay.hasHandlers());

export const DismissOverlayProvider = <T extends HTMLElement | Document = Document>({
  children,
  rootNode = document as any,
}: React.PropsWithChildren<{ rootNode?: T }>): React.ReactElement<any, any> => {
  const parentDismissOverlay = React.useContext(DismissOverlayContext);
  const handlers = React.useRef<Handler[]>([]);

  const subscriber = React.useMemo(() => new Subscriber(rootNode), [rootNode]);

  const dismissAll = React.useCallback(() => {
    handlers.current.forEach((handler) => handler());
  }, []);

  const addHandler = React.useCallback((handler: Handler) => {
    if (!handlers.current.includes(handler)) {
      handlers.current.push(handler);
    }
  }, []);

  const dismissLast = React.useCallback(() => {
    handlers.current[handlers.current.length - 1]?.();
  }, []);

  const hasHandlers = React.useCallback(() => {
    return handlers.current.length > 0;
  }, []);

  const removeHandler = React.useCallback((handler: Handler) => {
    handlers.current = withoutValue(handlers.current, handler);
  }, []);

  React.useEffect(() => {
    const globalOverlay = { dismissAll, hasHandlers };

    GLOBAL_OVERLAYS.push(globalOverlay);

    return () => {
      GLOBAL_OVERLAYS = withoutValue(GLOBAL_OVERLAYS, globalOverlay);
    };
  }, []);

  React.useEffect(() => {
    parentDismissOverlay?.subscriber.setChildrenSubscriber(subscriber);

    return () => {
      parentDismissOverlay?.subscriber.setChildrenSubscriber(null);
    };
  }, [subscriber, parentDismissOverlay]);

  const value = useContextApi<DismissOverlayValue<T>>({
    rootNode,
    subscriber,
    dismissAll,
    addHandler,
    dismissLast,
    hasHandlers,
    removeHandler,
    dismissAllGlobally,
    hasHandlersGlobally,
  });

  return <DismissOverlayContext.Provider value={value}>{children}</DismissOverlayContext.Provider>;
};

export const withDismissOverlay = withContext(DismissOverlayContext, 'dismissOverlay');
