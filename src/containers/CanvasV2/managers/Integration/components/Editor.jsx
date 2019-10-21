import React from 'react';

import { IntegrationType } from '@/constants';

import CustomApi from './Editors/CustomApi';
import GoogleSheets from './Editors/GoogleSheets';
import ZapierEditor from './Editors/Zapier';

function Editor({ data, type, onChange }) {
  return (
    <div>
      {type === IntegrationType.CUSTOM_API && <CustomApi onChange={onChange} data={data} />}
      {type === IntegrationType.GOOGLE_SHEETS && <GoogleSheets onChange={onChange} data={data} />}
      {type === IntegrationType.ZAPIER && <ZapierEditor onChange={onChange} data={data} />}
    </div>
  );
}

export default Editor;
