/* eslint-disable no-shadow */
import React from 'react';

import ImageIcon from '@/componentsV2/ImageIcon';
import Section from '@/componentsV2/Section';
import LocaleMap from '@/services/LocaleMap';

import ProductHeaderInfo from './components/ProductHeaderInfo';

function ProductTile({
  edit = false,
  isNested = false,
  imageIconSize,
  onClick,
  title,
  product: { name, smallIconUri, subscriptionFrequency, locales, type } = {},
}) {
  const localeNames = locales ? LocaleMap.filter(({ value }) => locales.includes(value)).map(({ name }) => name) : [];

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
