import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface CardDetailsProps {
  last4: string;
  brand: string;
}

enum CardBrand {
  jbc = 'jbc',
  amex = 'amex',
  visa = 'visa',
  union = 'union',
  cartes = 'cartes',
  diners = 'diners',
  discover = 'discover',
  mastercard = 'mastercard',
}

const isBrand = (brand: string): brand is CardBrand => Object.values(CardBrand).includes(brand as CardBrand);

const CardDetails: React.FC<CardDetailsProps> = ({ last4, brand: propBrand }) => {
  const brand = propBrand?.toLowerCase();

  return (
    <S.Container>
      {isBrand(brand) && <SvgIcon icon={brand} width={23.5} height={15.5} />}
      {last4}
    </S.Container>
  );
};

export default CardDetails;
