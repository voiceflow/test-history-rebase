import { GROWSURF_CAMPAIGN_ID, GROWSURF_ENABLED } from '@/config';

// eslint-disable-next-line import/prefer-default-export
export const initialize = () => {
  if (!GROWSURF_ENABLED) return;

  const script = document.createElement('script');
  script.src = 'https://growsurf.com/growsurf.js?v=2.0.0';
  script.setAttribute('grsf-campaign', GROWSURF_CAMPAIGN_ID);
  script.async = true;
  document.head.appendChild(script);
};
