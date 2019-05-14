/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { ModalHeader } from 'components/Modals/ModalHeader'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';

const blocks = [
  {
    type: "speak",
    info: "Speak blocks allow you to get Alexa to talk to the user. You can enter an unlimited amount of text, and even add variables in the text to have Alexa say the user’s names, or any other captured variable.",
    video: "https://www.youtube.com/embed/auyT6IRljHo"
  },
  {
    type: "audio",
    info: "Audio blocks let you add music, sound effects, or voice acting to your skill. Drag-n-drop or upload mp3 audio files to the audio block. You can also use text-to-speech to generate character voices for your skill. Lastly, you can combine multiple different sounds/music/voices together by adding another audio component within your audio block, and Voiceflow will automatically combine all the audio files together.",
    icon: <i className="fas fa-volume-up"/>,
    video: "https://youtu.be/embed/f-orXO8hCPg"
  },
  {
    type: "choice",
    info: "Choice blocks listen for the user to speak, and then send them to the matching path. When you ask a user a question, add a choice block after. In the choice block, you can add multiple choices ‘right’, ‘left’ and drag the path to the corresponding block. The ‘else’ statement in the choice block handles any answer that isn’t one of the choice options. If you have choices for ‘yes’ and ‘no’, but the user says ‘pineapple’, the else path will be activated.",
    icon: <i className="fas fa-project-diagram"/>,
    video: "https://www.youtube.com/embed/Tk47S6gfEiM"
  },
  {
    type: "command",
    info: "The command block allows the user to access global commands across your whole skill. At any point, a user can ask for a command block that you create such as ‘STOP’ or ‘HOME’ and the command block associated with that command will be activated, no matter where they are in your skill’s flow.",
    icon: <i className="fas fa-exclamation"/>,
    video: "https://www.youtube.com/embed/piU_PTL1wBQ"
  },
  {
    type: "random",
    info: "The random block acts similarly to a choice block. However, the major difference is there is no user input, and the choice block will randomly choose a path when it is activated. You can add multiple random paths, as well as remove them. If there is a path that is not connected to any following block, the skill will end so ensure you have all paths hooked up, or, remove the unused path. \n\n When smart descending random is turned on, if the same random block is activated again, it will not choose random paths it has already chosen.",
    icon: <i className="fas fa-random"/>,
    video: "https://www.youtube.com/embed/AAkQVd4TsgY"
  },
  {
    type: "variable",
    info: "Variables allow you to store & manipulate data. Once you create a variable, you need to set the variable to an initial value. You can also set variables to hold the value of other variables, or even to the value of an equation. \n\n Similar to programming, if you enter text it will be considered text and if you enter a number it will be considered a number. ‘Six’ is not a number. 6 is a number. With numbers, you can perform mathematical operations.",
    icon: <i className="fas fa-code"/>
  },
  {
    type: "if",
    info: "IF blocks allow you to choose a path for the user based on if a condition is true, or false. \n\n As an example, you can set an IF block to see if ‘variable = 5’. If the variable you selected is equal to 5, then the IF block will follow the true path. If the statement is false, the IF block will follow the false path.",
    icon: <i className="fas fa-code-branch"/>
  },
  {
    type: "capture",
    info: "Capture blocks allow you to ask the user a question and capture their response in a variable as text. You must have a variable created (using a variable block) to use capture. \n\n As an example, you can ask the user what their name is, and then use a capture block to capture the response into a variable called ‘user_name’ and then use the user’s name in your skill using a speak block to better personalize the experience. If the user says a number, such as ‘six’, the response will automatically be converted to a number format (‘six’ turns to ‘6’) to allow you to capture and use numbers.",
    icon: <i className="fas fa-microphone"/>,
    video: "https://www.youtube.com/embed/MYOW6FXvJ0o"
  },
  {
    type: "set",
    info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
    icon: <i className="fas fa-code"/>,
    video: "https://www.youtube.com/embed/6xgr-7GPZzU"
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
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-lock"/>,
  //   video: "https://www.youtube.com/embed/EHQuYN8U1ew"
  // },
  // {
  //   type: "mail",
  //   info: "Set blocks allow you to set the value of variables using combinations of logic and operations on variables.",
  //   icon: <i className="fas fa-envelope"/>,
  //   video: "https://www.youtube.com/embed/6yMxOQfmkVE"
  // }
]

class HelpModal extends React.Component {

  render() {

    let result;
    if(this.props.help && this.props.help.type){
      result = blocks.find(x => x.type === this.props.help.type);
    }

                      // {result.video ? <iframe width="560" height="315" src={result.video} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe> : null }

    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader header={this.props.help && this.props.help.type ? this.props.help.type : 'Blocks'} toggle={this.props.toggle} />
        <ModalBody>
          {this.props.help && this.props.help.type ?
            <React.Fragment>
              <div className="text-muted pl-3 pr-3 pb-3 pt-0">
                {result ? <React.Fragment>
                  <p className="mb-4">{result.info}</p>
                  {result.video &&
                    <div className="embed-responsive box-shadow embed-responsive-16by9 rounded">
                      <iframe src={result.video} allowFullScreen title="intro"></iframe>
                    </div>
                  }
                </React.Fragment> :
                "Information for this block doesn't exist yet. Check back again later"}
              </div>
            </React.Fragment> :
            <React.Fragment>
              {blocks.map((block, i) => {
                return (
                  <Card className="mb-1 MenuItem" key={i}>
                    <CardActionArea className={"helpMenu MenuItem " + block.type} onClick={()=>this.props.setHelp({type: block.type})}>
                      <div className="MenuIcon">{block.icon}</div><h5>{block.type}</h5>
                    </CardActionArea>
                  </Card>
                  )
              })}
            </React.Fragment>
          }
        </ModalBody>
      </Modal>
    );
  }
}

export default HelpModal;
