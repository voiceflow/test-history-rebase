import createSingleLinePlugin from 'draft-js-single-line-plugin';
import React from 'react';

import VariableText from '@/components/VariableText';

import Container from './components/VariableInputContainer';

function VariableInput({ leftSide, notLazy, ...props }) {
  const containerRef = React.useRef();
  const singleLinePlugin = React.useRef(createSingleLinePlugin({ stripEntities: false }));
  const onAddMention = (mention) =>
    setTimeout(() => {
      const scroller = containerRef.current.getElementsByClassName('public-DraftStyleDefault-block')[0];

      const scrollDistance = (mention.name.length + 2) * 9;

      scroller.scrollLeft += scrollDistance;
    }, 0);

  return (
    <Container ref={containerRef}>
      <VariableText
        plugins={[singleLinePlugin.current]}
        placeholder=""
        onAddMention={onAddMention}
        notLazy={notLazy}
        mentionClassName={leftSide && 'vi__displayOnLeft'}
        {...props}
      />
    </Container>
  );
}

export default VariableInput;
