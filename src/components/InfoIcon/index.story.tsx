import React from 'react';

import InfoIcon from '.';

export default {
  title: 'Info Icon',
  component: InfoIcon,
};

export const text = () => <InfoIcon>Just text</InfoIcon>;

export const richContent = () => (
  <InfoIcon>
    <div>
      <h1>Header</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus architecto atque beatae cumque ducimus ea earum error, explicabo hic
        inventore nam, necessitatibus odio quis repellat rerum sapiente sunt voluptatem voluptates.
      </p>
    </div>
  </InfoIcon>
);
