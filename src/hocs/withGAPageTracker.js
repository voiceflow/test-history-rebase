import React, { useEffect } from 'react';
import GoogleAnalytics from 'react-ga';

GoogleAnalytics.initialize('UA-47365686-9');

export default WrappedComponent => {
  const trackPage = page => {
    GoogleAnalytics.set({ page });
    GoogleAnalytics.pageview(page);
  };

  return function WithGATrackerHOC(props) {
    const page = props.location.pathname;

    useEffect(
      () => {
        process.env.NODE_ENV === 'development' && console.log('GA page view ->', page); // eslint-disable-line

        if (process.env.NODE_ENV === 'production') {
          trackPage(page);
          window.Intercom('update');
        }
      },
      [page]
    );

    return <WrappedComponent {...props} />;
  };
};
