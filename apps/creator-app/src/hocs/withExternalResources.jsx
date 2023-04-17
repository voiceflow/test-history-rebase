import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { IS_TEST } from '@/config';

const cachedRecourses = new Map();

function loadResource({ type, path, async, ...attrs }) {
  if (cachedRecourses.get(path)) {
    return Promise.resolve();
  }

  let wait = false;
  let tagType;
  let pathAttr;

  switch (type) {
    case 'script':
      wait = true;
      tagType = 'script';
      pathAttr = 'src';
      break;
    case 'link':
    case 'styles':
      tagType = 'link';
      pathAttr = 'href';
      break;
    default:
      tagType = 'meta';
  }

  const element = document.createElement(tagType);

  if (type === 'styles') {
    element.rel = 'stylesheet';
  } else if (type === 'script') {
    element.async = true;
  }

  if (pathAttr) {
    element[pathAttr] = path;
  }

  Object.keys(attrs).forEach((key) => {
    element[key] = attrs[key];
  });

  return new Promise((resolve) => {
    const loaded = () => {
      cachedRecourses.set(path, true);
      resolve();
    };

    if (wait) {
      element.onload = loaded;
    } else {
      loaded();
    }

    document.body.appendChild(element);
  });
}

export const withExternalResources =
  ({ resources, SpinnerComponent = null }) =>
  (Component) =>
    setDisplayName(wrapDisplayName(Component, 'withExternalResources'))(
      React.forwardRef((props, ref) => {
        // eslint-disable-next-line no-process-env
        const [loaded, setLoaded] = React.useState(IS_TEST);

        React.useEffect(() => {
          let unmounted = false;
          // eslint-disable-next-line promise/catch-or-return
          Promise.all(resources.map(loadResource)).then(() => !unmounted && setLoaded(true));

          return () => {
            unmounted = true;
          };
        }, []);

        if (!loaded && !SpinnerComponent) {
          return null;
        }

        if (!loaded) {
          return <SpinnerComponent text="Loading resources..." />;
        }

        return <Component {...props} ref={ref} />;
      })
    );
