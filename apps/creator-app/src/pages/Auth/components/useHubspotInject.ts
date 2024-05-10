import { IS_PRODUCTION } from '@voiceflow/ui';
import React from 'react';

const HUBSPOT_SCRIPT_URL = '//js.hs-scripts.com/22784288.js';
export const useHubspotInject = () => {
  React.useEffect(() => {
    const loadHubSpotScript = () => {
      if (!IS_PRODUCTION) return;

      // Check if the script is already loaded to avoid duplicates
      const existingScript = document.getElementById('hs-script-loader');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = HUBSPOT_SCRIPT_URL;
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        script.id = 'hs-script-loader';
        document.body.appendChild(script);
      }
    };

    loadHubSpotScript();

    // I don't think this actually works as intended, but leaving it here for now
    // Pretty sure the hs script loads other scripts, which isn't cleaned up by this logic
    return () => {
      const existingScript = document.getElementById('hs-script-loader');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);
};
