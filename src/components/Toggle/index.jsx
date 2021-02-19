import React from 'react';
import ReactToggle from 'react-toggle';

import { stopPropagation } from '@/utils/dom';

const Toggle = (props, ref) => <ReactToggle {...props} ref={ref} onClick={stopPropagation()} icons={false} />;

export default React.forwardRef(Toggle);
