declare module '*.svg' {
  import type React from 'react';

  const SVG: React.FC;

  export default SVG;
}

declare module '*.png' {
  const imageURL: string;

  export default imageURL;
}

declare module '*?url' {
  const url: string;

  export default url;
}
