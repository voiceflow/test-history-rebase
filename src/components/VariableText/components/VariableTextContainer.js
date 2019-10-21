import styled from 'styled-components';

const VariableTextContainer = styled.div`
  position: relative;

  & .mention,
  & .mention:visited {
    display: inline-block;
    border-radius: 2px;
    padding-right: 2px;
    padding-left: 2px;
    color: #575f67;
    text-decoration: none;
    background: #e6f3ff;
    cursor: pointer;
  }

  & .mention:hover,
  & .mention:focus {
    color: #677584;
    background: #edf5fd;
    outline: 0;
  }

  & .mention:active {
    color: #222;
    background: #455261;
  }

  & .mentionSuggestionsEntry {
    padding: 11px 10px 4px 33px;
    color: #0b1a38;
    font-size: 15px !important;
    background-image: url('/logic-gray.svg');
    background-repeat: no-repeat;
    background-position: 10% 50%;
    transition: all ease 0.15s;
  }

  & .mentionSuggestionsEntryFocused {
    padding: 11px 10px 4px 33px;
    color: #0b1a38;
    font-size: 15px;
    background-color: #f7f9fb;
    background-image: url('/logic.svg');
    background-repeat: no-repeat;
    background-position: 10% 50%;
  }

  & .mentionSuggestionsEntryText {
    display: inline-block;
    max-width: 368px;
    margin-bottom: 0.2em;
    margin-left: 8px;
    overflow: hidden;
    font-size: 0.9em;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & .mentionSuggestionsEntryAvatar {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 12px;
  }

  & .mentionSuggestions {
    box-sizing: border-box;
    position: absolute;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    min-width: 150px;
    max-width: 440px;
    margin-top: 0.4em;
    padding-top: 8px;
    padding-bottom: 8px;
    color: #0b1a38 !important;
    background-color: #fff;
    z-index: 2;
    box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
    transform: scale(0);
    cursor: pointer;
  }
`;

export default VariableTextContainer;
