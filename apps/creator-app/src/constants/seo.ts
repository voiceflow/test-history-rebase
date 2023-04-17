interface PageMetaType {
  title: string;
  meta: string;
  h1?: string;
}

export enum SeoPage {
  ROOT = 'root',
  LOGIN = 'login',
  SIGNUP = 'signup',
  SSML = 'ssml',
  DASHBOARD = 'dashboard',
  PROTOTYPE = 'prototype',
}

export const PageMeta: Record<SeoPage, PageMetaType> = {
  [SeoPage.ROOT]: {
    h1: '',
    title: 'Voiceflow | Creator',
    meta: 'Design, prototype, and launch voice and conversation experiences. Build powerful conversation designs for chatbots and voicebots in minutes.',
  },
  [SeoPage.LOGIN]: {
    h1: 'Login to your Voiceflow Account',
    title: 'Voiceflow | Log In to your Account',
    meta: 'Design, prototype, and launch voice and conversation experiences. Log in to create your next conversation design in minutes.',
  },
  [SeoPage.SIGNUP]: {
    h1: 'Signup for your Account',
    title: 'Voiceflow | Sign up for a new Account',
    meta: 'Design, prototype, and launch voice and conversation experiences. Sign up for free and get started building conversation designs today.',
  },
  [SeoPage.SSML]: {
    h1: 'Voiceflow SSML Editor',
    title: 'Voiceflow | SSML Editor',
    meta: 'Add custom SSML to any conversation design. Generate custom pitches, tones, and speeds to add life to your CxD, for free.',
  },
  [SeoPage.DASHBOARD]: {
    h1: '',
    title: 'Voiceflow | Dashboard',
    meta: 'Design, prototype, and launch chatbots and voicebots in Voiceflow. Organize, share, and collaborate all in your dashboard.',
  },
  [SeoPage.PROTOTYPE]: {
    h1: '',
    title: 'Voiceflow | Prototype Testing',
    meta: "Test, train, and prototype any of your conversation designs in Voiceflow's smart prototyping tool.",
  },
};
