/* eslint-disable import/prefer-default-export */
import { plus } from '@ui/svgs';
import React from 'react';

import { Button } from './styles';

interface PlusButtonProps {
  onClick: () => void;
}

export const PlusButton: React.FC<PlusButtonProps> = () => <Button>{plus}</Button>;
