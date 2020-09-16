import React from 'react';

export const GoogleLanguage: React.FC = () => {
  return <span>Choose the language your Google Action will support. This can be changed later.</span>;
};

export const AmazonLanguage: React.FC = () => {
  return (
    <span>
      Choose one or more{' '}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://developer.amazon.com/en-US/docs/alexa/faq/distribute-your-skill-to-additional-locales-of-the-same-language.html"
      >
        locales
      </a>{' '}
      you want your Skill to be accessible in. This can be changed later.
    </span>
  );
};
