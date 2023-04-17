import React from 'react';

import * as S from './styles';

interface SectionProps extends React.PropsWithChildren {
  mb?: number;
  w?: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(({ mb, w, title, children, description }, ref) => (
  <S.Container ref={ref} mb={mb} w={w}>
    {title && <S.Title withDescription={!!description}>{title}</S.Title>}

    {description && <S.Description>{description}</S.Description>}

    {children}
  </S.Container>
));

export default Section;
