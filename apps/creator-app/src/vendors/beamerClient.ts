interface BeamerParams {
  user_id?: string;
  user_email?: string;
  user_lastname?: string;
  user_firstname?: string;
  user_created_at?: string;
}

interface BeamerConfig extends BeamerParams {
  lazy?: boolean;
  product_id: string;
  user_email?: string;
}

declare global {
  interface Window {
    Beamer?: {
      init: VoidFunction;
      update: (options: BeamerParams) => void;
      destroy: VoidFunction;
      started: boolean;
    };
    beamer_config?: BeamerConfig;
  }
}

const setConfig = (options: BeamerParams) => {
  window.beamer_config = { ...options, product_id: 'qvIvrouC48130' };
};

export const initialize = (options: BeamerParams = {}) => {
  if (window.Beamer) {
    window.Beamer.init();
    return;
  }

  setConfig(options);

  const script = document.createElement('script');
  script.src = 'https://app.getbeamer.com/js/beamer-embed.js';
  script.async = true;
  document.body.appendChild(script);
};

export const destroy = () => {
  window.Beamer?.destroy();
};

export const updateParameters = (options: BeamerParams = {}) => {
  if (window.Beamer) {
    window.Beamer.update(options);
  } else {
    setConfig(options);
  }
};
