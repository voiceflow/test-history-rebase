import React from 'react';

import TextArea from '@/componentsV2/TextArea';

const ListManagerForm = ({ onChange, ...props }) => <TextArea {...props} onChange={(e) => onChange(e.target.value)} />;

export default ListManagerForm;
