export const GOOGLE_STAGES = {
  0: 'No Google Token Found',
  1: 'No Project ID Found',
  2: 'Confirm Publish',
  3: 'Rendering',
  4: 'Publishing',
  5: 'Published',
};

// USE AS REFERENCE
// const ALEXA_STAGES = {
//     "0": "Upload Skill",
//     "1": "Voiceflow Rendering",
//     "2": "Success",
//     "4": "Rendering Error",
//     "5": "Amazon Login",
//     "6": "Developer Account",
//     "7": "Check Vendor",
//     "8": "Verifying Login",
//     "9": "Amazon Error",
//     "11": "Uploading to Alexa",
//     "12": "Building Interaction Model",
//     "13": "Enable Skill",
//     "14": "Invocation Name",
// }

export const SHOW_PROMPT_ALEXA = [4, 5, 6, 9, 14, 2];

export const STAGE_PERCENTAGES = {
  alexa: {
    1: [0, 5],
    11: [10, 49],
    12: [50, 95],
    13: [96, 100],
  },
  google: {
    3: [0, 59],
    4: [60, 98],
  },
};

// Loading without percentages
export const LOADING_STAGES = {
  alexa: [7, 8],
  google: [],
};

export const ENDING_STAGES = {
  alexa: [2, 4, 9, 10],
  google: [2, 5],
};
export const LAUNCH_PHRASES = ['launch', 'ask', 'tell', 'load', 'begin', 'enable'];
export const WAKE_WORDS = ['Alexa', 'Amazon', 'Echo', 'Skill', 'App'];
