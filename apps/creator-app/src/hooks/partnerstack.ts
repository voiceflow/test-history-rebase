import React from 'react';

import { IS_PRODUCTION, PARTNER_STACK_PUBLIC_KEY } from '@/config';

const SCRIPT_ID = 'partnerstack-script-loader';

declare global {
  interface Window {
    growsumo: {
      _spk?: VoidFunction;
      data: {
        partner_key: string;
      };
    };
  }
}

const loadPartnerStackScript = () => {
  if (!IS_PRODUCTION) return null;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = SCRIPT_ID;
  script.defer = true;
  script.async = true;
  document.body.appendChild(script);
  script.innerHTML = `(function() {var gs = document.createElement('script');gs.src = 'https://partners.voiceflow.com/pr/js';gs.type = 'text/javascript';gs.async = 'true';gs.onload = gs.onreadystatechange = function() {var rs = this.readyState;if (rs && rs != 'complete' && rs != 'loaded') return;try {growsumo._initialize('${PARTNER_STACK_PUBLIC_KEY}'); if (typeof(growsumoInit) === 'function') {growsumoInit();}} catch (e) {}};var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(gs, s);})();`;

  return script;
};

export const usePartnerStack = () => {
  React.useEffect(() => {
    if (!PARTNER_STACK_PUBLIC_KEY) return;
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = loadPartnerStackScript();
    }
  }, []);

  return React.useCallback(() => {
    if (!window.growsumo) return undefined;
    window.growsumo._spk?.();
    return window.growsumo.data?.partner_key;
  }, []);
};
