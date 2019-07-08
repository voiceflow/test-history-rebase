// TYPES
export const SHOW_HELP = 'SHOW_HELP';
export const CLEAR_HELP = 'CLEAR_HELP';

const initialState = {
  showHelp: false,
  help: {},
};

// REDUCER
export default function alertsReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_HELP:
      return {
        ...state,
        help: {
          header: action.payload.header,
          message: action.payload.message,
          link: action.payload.link,
          video: action.payload.video,
        },
        showHelp: true,
      };
    case CLEAR_HELP:
      return {
        ...state,
        showHelp: false,
      };
    default:
      return state;
  }
}

export const clearHelp = () => ({
  type: CLEAR_HELP,
});

// This action expects an object with properties
// header, message, link, and video
export const showHelp = (modalContents) => ({
  type: SHOW_HELP,
  payload: {
    header: modalContents.header,
    message: modalContents.message,
    link: modalContents.link,
    video: modalContents.video,
  },
});
