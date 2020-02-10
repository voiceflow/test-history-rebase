/* eslint-disable no-secrets/no-secrets */
import React from 'react';

import Modal, { ModalBody, ModalHeader } from '@/components/LegacyModal';

const blocks = [
  {
    type: 'speak',
    info:
      'Speak blocks allow you to get Alexa to talk to the user. You can enter an unlimited amount of text, and even add variables in the text to have Alexa say the user’s names, or any other captured variable. Choose from over 30 different Alexa voices.',
    video: 'https://www.youtube.com/embed/auyT6IRljHo',
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/speak-block',
  },
  {
    type: 'audio',
    info:
      'Audio blocks let you add music, sound effects, or voice acting to your skill. Drag-n-drop or upload mp3 audio files to the audio block. You can also use text-to-speech to generate character voices for your skill. Lastly, you can combine multiple different sounds/music/voices together by adding another audio component within your audio block, and Voiceflow will automatically combine all the audio files together.',
    icon: <i className="fas fa-volume-up" />,
    video: 'https://youtu.be/embed/f-orXO8hCPg',
  },
  {
    type: 'choice',
    info:
      'Choice blocks listen for the user to speak, and then send them to the matching path. When you ask a user a question, add a choice block after. In the choice block, you can add multiple choices ‘right’, ‘left’ and drag the path to the corresponding block. The ‘else’ statement in the choice block handles any answer that isn’t one of the choice options. If you have choices for ‘yes’ and ‘no’, but the user says ‘pineapple’, the else path will be activated.',
    icon: <i className="fas fa-project-diagram" />,
    video: 'https://www.youtube.com/embed/Tk47S6gfEiM',
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/choice-block',
  },
  {
    type: 'command',
    info:
      'Commands can be accessed by the user from anywhere in your skill. For example, if a user says "Alexa, help" while in your skill, they will activate the help flow. Once a user is done with the help flow, they will be returned to wherever they previously were in the project.',
    icon: <i className="fas fa-exclamation" />,
    video: 'https://www.youtube.com/embed/piU_PTL1wBQ',
  },
  {
    type: 'random',
    info:
      'The random block acts similarly to a choice block. However, the major difference is there is no user input, and the choice block will randomly choose a path when it is activated. You can add multiple random paths, as well as remove them. If there is a path that is not connected to any following block, the skill will end so make sure you have all paths hooked up, or, remove the unused path. When "no duplicates" is selected, the block will not choose random paths it has already chosen.',
    icon: <i className="fas fa-random" />,
    video: 'https://www.youtube.com/embed/AAkQVd4TsgY',
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/random-block',
  },
  {
    type: 'variable',
    info:
      'Variables allow you to store & manipulate data. Once you create a variable, you need to set the variable to an initial value. You can also set variables to hold the value of other variables, or even to the value of an equation. \n\n Similar to programming, if you enter text it will be considered text and if you enter a number it will be considered a number. ‘Six’ is not a number. 6 is a number. With numbers, you can perform mathematical operations.',
    icon: <i className="fas fa-code" />,
  },
  {
    type: 'if',
    info:
      'IF blocks allow you to choose a path for the user based on if a condition is true, or false. As an example, you can set an IF block to see if ‘variable = 5’. If the variable you selected is equal to 5, then the IF block will follow the true path. If the statement is false, the IF block will follow the false path. Note, all If statements are evaluated in numerical order. ',
    icon: <i className="fas fa-code-branch" />,
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/if-block',
  },
  {
    type: 'capture',
    info:
      'Capture blocks allow you to ask the user a question and capture their response in a variable as text. You must create a variable first to use capture. Hover over to the left-hand side menu and select variables. As an example, you can ask the user what their name is, and then use a capture block to capture the response into a variable called {user_name} and then use the user’s name in your skill using a speak block to better personalize the experience. If the user says a number, such as ‘six’, the response will automatically be converted to a number format (‘six’ turns to ‘6’) to allow you to capture and use numbers.',
    icon: <i className="fas fa-microphone" />,
    video: 'https://www.youtube.com/embed/MYOW6FXvJ0o',
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/capture-block',
  },
  {
    type: 'set',
    info: 'Set blocks allow you to set the value of variables using combinations of logic and operations on variables.',
    icon: <i className="fas fa-code" />,
    video: 'https://www.youtube.com/embed/6xgr-7GPZzU',
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/set-block',
  },
  {
    type: 'interaction',
    info:
      "The interaction block is used whenever you need to give the user a set of choices and the choice block can not fulfill our needs. The interaction block lets us capture information from what the user says. There is a list of intents that we can select from Amazon and Google's defaults which have been set up to capture things that you say. You can also create custom intents.",
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/interaction-block',
  },
  {
    type: 'intent',
    info:
      'Intent blocks allow you to add shortcuts within your project. With Intent blocks, a user can say an intent at any point within the project (or outside the project) and be brought to a defined point.\n' +
      "For example, you could add an intent for 'Home' which allows the user to always return to a home menu using the Intent block. Or, you could use an Intent Block to jump to a new place in an interactive story ⏤ the use cases are endless.",
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/intent-block',
  },
  {
    type: 'stream',
    info:
      'The stream block allows you to stream audio files longer than 90 seconds at a higher quality than than adding an audio file to a speak block. The stream block supports the following file types:\n' +
      "MP3, AAC/MP4, HLS/M4U. The stream block works very differently than adding an audio file to a speak block. Unlike the speak block, when a user hits your stream block - the user is actually leaving your skill. This functionality was built-in by Amazon. The user only returns to your skill if they say one of the Stream block's keyword functions: Alexa, Pause, Next, Previous.",
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/stream-block',
  },
  {
    type: 'integration',
    dbType: 'integrations',
    info:
      "The integrations block allows you to connect to 3rd party services, or your own service's API, seamlessly. Within Voiceflow you can either choose a pre-packaged integration that we've provided which only requires that you link your account - or - you can perform a custom API call to any API of your choice.",
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/integrations-block',
  },
  {
    type: 'flow',
    info:
      'The flow block allows you to organize your project into more manageable section. A flow is a set of blocks in Voiceflow organized within a single canvas. When you are working on Voiceflow, everything you can see on the canvas is all stored within a single flow. \n' +
      'Flows are like boxes that contain your building blocks. Flows can contain other flows, allowing you to stack them and organize thousands of Voiceflow blocks into easy, manageable sections that you can duplicate and reuse. You can check your flows on the left-hand side menu.',
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/flow-block',
  },
  {
    type: 'code',
    info:
      'The code block accepts a popular programming language known as JavaScript. You can write custom Javascript in your voice app which can be used to manipulate variables.\n',
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/code-block',
  },
  {
    type: 'exit',
    info:
      'The exit block exits the skill. The skill will end immediately without any text playing.\n' +
      'Its use is very convenient to leave the skill from a flow (by default, the flow will return to the last place from which it was used).',
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/exit-block',
  },
  {
    type: 'card',
    info: 'The card block allows you to upload an image where users can view the card on the Alexa mobile app. ',
    link: 'https://learn.voiceflow.com/articles/2632586-card-block',
  },
  {
    type: 'display',
    info:
      'The display block allows you to control and manipulate visuals on Alexa screen devices. You can show a multimodal display on the screen using APL.',
    link: 'https://learn.voiceflow.com/articles/2632588-display-block-apl',
  },
  {
    type: 'permission',
    info: 'The permission block allows you to ask users to enable permissions such as reminders, user info, etc.\n',
    link: 'https://learn.voiceflow.com/articles/2504415-permission-user-info-block',
  },
  {
    type: 'user_info',
    dbType: 'permissions',
    info: 'The user info block allows you to ask your users for their names, emails, and phone numbers, etc. \n',
    link: 'https://learn.voiceflow.com/articles/2504415-permission-user-info-block',
  },
  {
    type: 'payment',
    info:
      'The payment block allows you to add an In-Skill Purchase where you can sell premium content where users can opt for one-time purchases, subscriptions or consumables. Skills can still be free to use, but ISPs are useful when you want to offer premium content (e.g. upgraded versions of a game skill). Currently, the ISP feature is only available in the US.',
    link: 'https://docs.voiceflow.com/voiceflow-documentation/monetization/alexa-in-skill-purchases',
  },
  {
    type: 'cancel_payment',
    dbType: 'cancel',
    info:
      'The cancel payment block is necessary for any skill that has In-Skill Purchases in case the user wants to a refund or cancels a payment. For example, a user might want to end their subscription.\n',
    link: 'https://docs.voiceflow.com/voiceflow-documentation/monetization/alexa-in-skill-purchases',
  },
  {
    type: 'reminder',
    info:
      'The reminder blocks allows you to set a timer along with a reminder to the user. You will need the User Info block to check if the user has authorized access to the Reminder for your skill. Add a User Info block and click on + Add Permission Request',
    link: 'https://docs.voiceflow.com/voiceflow-documentation/untitled/reminder-block',
  },
  // {
  //   type: "jump",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-step-forward"/>,
  //   video: "https://www.youtube.com/embed/-nwWqo2v86U"
  // },
  // {
  //   type: "intent",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-user-alt"/>,
  //   video: "https://www.youtube.com/embed/mxe1iwDboHc"
  // },
  // {
  //   type: "stream",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-play"/>,
  //   video: "https://www.youtube.com/embed/I6rMkA4JPRM"
  // },
  // {
  //   type: "api",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-globe"/>,
  //   video: "https://www.youtube.com/embed/6rnoN8rnBrs"
  // },
  // {
  //   type: "flow",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-clone"/>,
  //   video: "https://www.youtube.com/embed/EMpqNf2HhKw"
  // },
  // {
  //   type: "exit",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-sign-out"/>,
  //   video: "https://www.youtube.com/embed/mxe1iwDboHc"
  // },
  // {
  //   type: "combine",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-compress-alt"/>,
  //   video: "https://www.youtube.com/embed/mxe1iwDboHc"
  // },
  // {
  //   type: "comment",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-comment"/>,
  //   video: "https://www.youtube.com/embed/mxe1iwDboHc"
  // },
  // {
  //   type: "card",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-sticky-note"/>,
  //   video: "https://www.youtube.com/embed/bQLdxSoXh0Y"
  // },
  // {
  //   type: "card",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-sticky-note"/>,
  //   video: "https://www.youtube.com/embed/mxe1iwDboHc"
  // },
  // {
  //   type: "display",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="far fa-image"/>,
  //   video: "https://www.youtube.com/embed/mxe1iwDboHc"
  // },
  // {
  //   type: "permissions",
  //   //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   //   icon: <i className="fas fa-lock"/>,
  //   //   video: "https://www.youtube.com/embed/EHQuYN8U1ew"
  //   // },
  // {
  //   type: "mail",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-envelope"/>,
  //   video: "https://www.youtube.com/embed/6yMxOQfmkVE"
  // }
];

class HelpModal extends React.Component {
  render() {
    const { help, open, toggle } = this.props;
    let result;
    if (help && help.type) {
      result = blocks.find((x) => x.type === help.type);
    }

    return (
      <Modal isOpen={open} toggle={toggle}>
        <ModalHeader header={result?.dbType || result?.type || 'Blocks'} toggle={toggle} />
        <ModalBody>
          <div className="text-muted pl-3 pr-3 pb-3 pt-0">
            {result ? (
              <>
                <p className="mb-4">{result.info}</p>
                {result.link && (
                  <a href={result.link} rel="noopener noreferrer" target="_blank" className="btn-link">
                    See More
                  </a>
                )}
                {result.video && (
                  <div className="embed-responsive box-shadow embed-responsive-16by9 rounded mt-4">
                    <iframe src={result.video} allowFullScreen title="intro" />
                  </div>
                )}
              </>
            ) : (
              "Information for this block doesn't exist yet. Check back again later"
            )}
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default HelpModal;
