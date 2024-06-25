import type { SectionV2Types } from '@voiceflow/ui';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

interface TitleProps extends SectionV2Types.TitleProps, React.PropsWithChildren {}

const Title: React.FC<TitleProps> = (props) => <SectionV2.Title bold mb={4} {...props} />;

export default Title;
