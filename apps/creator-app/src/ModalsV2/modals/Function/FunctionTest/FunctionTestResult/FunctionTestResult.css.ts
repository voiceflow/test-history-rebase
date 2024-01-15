import { recipe, style } from '@voiceflow/style';
import { Theme } from '@voiceflow/ui-next/styles';

// test modal
const TEST_MODAL_EMPTY_HEIGHT = 196;
const TEST_MODAL_MIN_HEIGHT = 240;
const TEST_MODAL_MEDIUM_HEIGHT = 316;
const TEST_MODAL_MAX_HEIGHT = 392;

// spacings
const MODALS_TOTAL_PADDING = 64;
const MODAL_MARGIN_TOP = 16;

// sections
const SECTIONS_CLOSE_HEIGHT = 218;
const SECTIONS_RESOLVED_PATH_OPENED_HEIGHT = 264;
const SECTIONS_OUTPUT_OPENED_HEIGHT = 302;
const SECTIONS_OPENED_HEIGHT = 348;

const calculateTestsModalMaxHeight = (testModalHeight: number) =>
  `calc(100vh - ${testModalHeight}px - ${MODALS_TOTAL_PADDING}px - ${MODAL_MARGIN_TOP}px)`;
const calculateTestsResponseMaxHeight = (testModalHeight: number, testResponseHeight: number) =>
  `calc(100vh - ${testModalHeight}px - ${MODALS_TOTAL_PADDING}px - ${MODAL_MARGIN_TOP}px - ${testResponseHeight}px)`;

export const testResults = recipe({
  base: {
    color: Theme.vars.color.font.default,
    minHeight: '220px',
    overflow: 'hidden',
  },

  variants: {
    inputs: {
      empty: { maxHeight: calculateTestsModalMaxHeight(TEST_MODAL_EMPTY_HEIGHT) },
      min: { maxHeight: calculateTestsModalMaxHeight(TEST_MODAL_MIN_HEIGHT) },
      medium: { maxHeight: calculateTestsModalMaxHeight(TEST_MODAL_MEDIUM_HEIGHT) },
      max: { maxHeight: calculateTestsModalMaxHeight(TEST_MODAL_MAX_HEIGHT) },
    },
    sections: {
      none: {
        minHeight: 'auto',
      },
      closed: {},
      resolvedPathOpened: {},
      outputOpened: {},
      opened: {},
    },
  },
});

export const fullWidthStyle = style({ width: '100%' });

export const jsonEditorStyles = style({
  marginTop: '0px',
});

export const jsonCollapsibleStyles = recipe({
  base: {
    padding: 0,
    overflow: 'auto',
  },

  variants: {
    inputs: {
      empty: {},
      min: {},
      medium: {},
      max: {},
    },
    sections: {
      closed: {},
      outputOpened: {},
      resolvedPathOpened: {},
      opened: {},
      none: {},
    },
  },

  compoundVariants: [
    // closed
    {
      variants: {
        inputs: 'empty',
        sections: 'closed',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_EMPTY_HEIGHT, SECTIONS_CLOSE_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'min',
        sections: 'closed',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MIN_HEIGHT, SECTIONS_CLOSE_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'medium',
        sections: 'closed',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MEDIUM_HEIGHT, SECTIONS_CLOSE_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'max',
        sections: 'closed',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MAX_HEIGHT, SECTIONS_CLOSE_HEIGHT),
      },
    },

    // resolved path opened
    {
      variants: {
        inputs: 'empty',
        sections: 'resolvedPathOpened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_EMPTY_HEIGHT, SECTIONS_RESOLVED_PATH_OPENED_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'min',
        sections: 'resolvedPathOpened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MIN_HEIGHT, SECTIONS_RESOLVED_PATH_OPENED_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'medium',
        sections: 'resolvedPathOpened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MEDIUM_HEIGHT, SECTIONS_RESOLVED_PATH_OPENED_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'max',
        sections: 'resolvedPathOpened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MAX_HEIGHT, SECTIONS_RESOLVED_PATH_OPENED_HEIGHT),
      },
    },

    // output variables opened
    {
      variants: {
        inputs: 'empty',
        sections: 'outputOpened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_EMPTY_HEIGHT, SECTIONS_OUTPUT_OPENED_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'min',
        sections: 'outputOpened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MIN_HEIGHT, SECTIONS_OUTPUT_OPENED_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'medium',
        sections: 'outputOpened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MEDIUM_HEIGHT, SECTIONS_OUTPUT_OPENED_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'max',
        sections: 'outputOpened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MAX_HEIGHT, SECTIONS_OUTPUT_OPENED_HEIGHT),
      },
    },

    // opened
    {
      variants: {
        inputs: 'empty',
        sections: 'opened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_EMPTY_HEIGHT, SECTIONS_OPENED_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'min',
        sections: 'opened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MIN_HEIGHT, SECTIONS_OPENED_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'medium',
        sections: 'opened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MEDIUM_HEIGHT, SECTIONS_OPENED_HEIGHT),
      },
    },
    {
      variants: {
        inputs: 'max',
        sections: 'opened',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MAX_HEIGHT, SECTIONS_OPENED_HEIGHT),
      },
    },

    // none
    {
      variants: {
        inputs: 'empty',
        sections: 'none',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_EMPTY_HEIGHT, 0),
      },
    },
    {
      variants: {
        inputs: 'min',
        sections: 'none',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MIN_HEIGHT, 0),
      },
    },
    {
      variants: {
        inputs: 'medium',
        sections: 'none',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MEDIUM_HEIGHT, 0),
      },
    },
    {
      variants: {
        inputs: 'max',
        sections: 'none',
      },
      style: {
        maxHeight: calculateTestsResponseMaxHeight(TEST_MODAL_MAX_HEIGHT, 0),
      },
    },
  ],
});

export const mapperStyles = style({
  paddingBottom: 14,
});

export const sectionRecipe = recipe({
  variants: {
    disabled: { true: { opacity: 0.65, cursor: 'not-allowed' } },
    limited: { true: { maxHeight: '84px', overflow: 'auto' } },
  },
});

export const rhsMapperStyles = style({
  paddingLeft: 5,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  // this  limits block line count to 4 lines
  WebkitLineClamp: 4,
  maxHeight: 80,
});
