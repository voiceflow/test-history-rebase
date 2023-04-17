import React from 'react';

import Description, { DescriptionProps } from './Description';

interface RadioGroupDescriptionProps extends DescriptionProps {
  offset?: boolean;
}

const RadioGroupDescription: React.FC<RadioGroupDescriptionProps> = ({ offset, ...props }) => <Description pt={offset ? 42 : 0} {...props} />;

export default RadioGroupDescription;
