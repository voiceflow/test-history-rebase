import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import ImageIcon from '@/components/ImageIcon';
import Section from '@/components/Section';

import ProductHeaderInfo from './components/ProductHeaderInfo';

function ProductTile({
  edit = false,
  isNested = false,
  imageIconSize,
  onClick,
  title,
  product: { name, smallIconUri, subscriptionFrequency, locales, type } = {},
}) {
  const localeNames = React.useMemo(
    () => locales?.map((locale) => Platform.Alexa.CONFIG.types.voice.project.locale.labelMap[locale]) ?? [],
    [locales]
  );

  const header = (
    <ProductHeaderInfo title={title} name={name} subscriptionFrequency={subscriptionFrequency} localeNames={localeNames} type={type} edit={edit} />
  );

  return (
    <Section
      header={header}
      isLink
      isDividerNested={isNested}
      onClick={onClick}
      prefix={<ImageIcon background={smallIconUri} size={imageIconSize} placeholderSize={16} />}
    />
  );
}

export default ProductTile;
