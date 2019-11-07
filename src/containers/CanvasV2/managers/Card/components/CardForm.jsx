import React from 'react';
import { Tooltip } from 'react-tippy';

import Button from '@/components/Button';
import Image from '@/components/Uploads/Image';
import VariableInput from '@/components/VariableInput';
import { FlexApart } from '@/componentsV2/Flex';

function CardForm({ data, onChange, withImage }) {
  const toggleSmallImage = React.useCallback(() => onChange({ hasSmallImage: !data.hasSmallImage }), [data.hasSmallImage, onChange]);
  const updateSmallImage = React.useCallbaclk((smallImage) => onChange({ smallImage, hasSmallImage: true }), [onChange]);
  const updateLargeImage = React.useCallback((largeImage) => onChange({ largeImage }), [onChange]);
  const updateTitle = React.useCallback((title) => onChange({ title }), [onChange]);

  return (
    <>
      <label>Title</label>
      <VariableInput className="form-control mb-3" value={data.title} onChange={updateTitle} placeholder="Insert card title" />
      {withImage && (
        <>
          <FlexApart as="label">
            Image <span className="section-title">OPTIONAL</span>
          </FlexApart>
          <Image url max_size={5 * 1024 * 1024} image={data.largeImage} update={updateLargeImage} />
          {data.hasSmallImage && (
            <>
              <label>Small Screen Image</label>
              <Image url max_size={5 * 1024 * 1024} image={data.smallImage} update={updateSmallImage} margin />
            </>
          )}
          <Button isFlat isBlock onClick={toggleSmallImage}>
            {data.hasSmallImage ? (
              'Remove Small Image'
            ) : (
              <Tooltip position="bottom" html={<div style={{ width: 165 }}>Small screens use the normal image by default</div>}>
                Add Small Screen Image
              </Tooltip>
            )}
          </Button>
        </>
      )}
    </>
  );
}

export default CardForm;
