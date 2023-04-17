declare module '*.svg' {
  import React from 'react';

  const SVG: React.FC;

  export default SVG;
}

declare module '*?url' {
  const svgURL: string;

  export default svgURL;
}

declare module '*.png' {
  const imageURL: string;

  export default imageURL;
}

declare module '*.csv' {
  const csvURL: string;

  export default csvURL;
}
