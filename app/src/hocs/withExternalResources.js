import React, { Component } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

import Loader from 'components/Loader';

const cache = {};

export default ({ resources, withoutLoader }) => Wrapper =>
  class WithExternalResources extends Component {
    static displayName = wrapDisplayName(Wrapper, 'WithExternalResources');

    static loadResource({ type, path, async, ...attrs }) {
      return new Promise(resolve => {
        if (cache[path]) {
          return resolve();
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

        Object.keys(attrs).forEach(key => {
          element[key] = attrs[key];
        });

        document.body.appendChild(element);

        const loaded = () => {
          cache[path] = true;
          resolve();
        };

        if (wait) {
          element.onload = loaded;
        } else {
          loaded();
        }
      });
    }

    constructor(props) {
      super(props);

      this.state = { loaded: false };

      this.loadedResources();
    }

    async loadedResources() {
      await Promise.all(resources.map(WithExternalResources.loadResource));

      this.setState({ loaded: true });
    }

    render() {
      const { loaded } = this.state;

      if (withoutLoader && !loaded) {
        return null;
      }

      return (
        <Loader text="Loading resources..." pending={!loaded}>
          {() => <Wrapper {...this.props} />}
        </Loader>
      );
    }
  };
