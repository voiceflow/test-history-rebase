import React from 'react';
import { Helmet } from 'react-helmet';

import type { SeoPage } from '@/constants/seo';
import { PageMeta } from '@/constants/seo';

interface SeoHelmetInterface {
  page: SeoPage;
}

const SeoHelmet: React.FC<SeoHelmetInterface> = ({ page }) => {
  const pageSeoMeta = PageMeta[page];
  return (
    <Helmet>
      <title>{pageSeoMeta.title}</title>
      <meta content={pageSeoMeta.meta} />
    </Helmet>
  );
};

export default SeoHelmet;
