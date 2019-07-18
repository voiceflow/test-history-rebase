import styled from 'styled-components';

const GuidedStepsWrapper = styled.div`
  max-width: 1040px;
  margin-left: auto;
  margin-right: auto;
  padding: 32px;

  .alert {
    margin-bottom: 15px;
  }

  .alert:last-child {
    margin-bottom: 0px;
  }

  ul {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }

  textarea {
    resize: none;
  }

  .gs__steps-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .gs__steps-list__list-item.gs__is-active {
    padding-bottom: 32px;

    .gs__steps-list__title {
      font-weight: 600;
    }

    &:before {
      -webkit-box-shadow: 0 2px 4px 0 rgba(17, 49, 96, 0.16);
      box-shadow: 0 2px 4px 0 rgba(17, 49, 96, 0.16);
      border: 8px solid #fff;
      background-image: linear-gradient(180deg, rgba(93, 157, 245, 0.85) 0%, #2c85ff 100%);
      background-origin: content-box;
    }
  }

  .gs__steps-list__list-item {
    position: relative;
    padding-left: 48px;
    padding-bottom: 34px;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid #d4d9e6;
    }
    &:after {
      content: '';
      position: absolute;
      left: 12px;
      top: 24px;
      bottom: 0;
      width: 1px;
      background-color: #d4d9e6;
    }
  }

  .gs__hide-a {
    height: 0;
    overflow-y: hidden;
  }

  .gs__steps-list__list-item.gs__is-filled.gs__is-active {
    &:before {
      background-origin: inherit;
    }
  }

  .gs__steps-list__list-item.gs__is-filled {
    &:before {
      //background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(78, 111, 249, 0.85)), color-stop(96%, #4e6ff9));
      //background-image: -webkit-linear-gradient(top, rgba(78, 111, 249, 0.85), #4e6ff9 96%);
      //background-image: -o-linear-gradient(top, rgba(78, 111, 249, 0.85), #4e6ff9 96%);
      //background-image: linear-gradient(-180deg, rgba(78, 111, 249, 0.85), #4e6ff9 96%);
      background: url('check-white.svg');
      background-size: 8px 8px;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-color: #5d9df5;
      border-width: 0;
      display: inline-block;
      vertical-align: top;
      color: #fff;
      padding: 4px;
      margin: 0;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
    &:after {
      background-color: #5d9df5;
    }
  }

  .gs__steps-list__list-item.gs__is-error {
    &:before {
      background: url('cancel-copy.svg');
      background-size: 8px 8px;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-color: #e91e63;
      border-width: 0;
      display: inline-block;
      vertical-align: top;
      padding: 4px;
      margin: 0;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
    &:after {
      background-color: #e91e63;
    }
  }

  li {
    display: list-item;
    text-align: -webkit-match-parent;
  }

  li:last-child {
    &:after {
      background-color: transparent !important;
    }
  }

  .gs__steps-list__title {
    display: inline-block;
    vertical-align: top;
    font-size: 15px;
    color: #62778c;
  }

  .gs__clickable-step {
    cursor: pointer;
    &:hover {
      color: #5d9df5;
    }
    &:active {
      color: #326fc3;
    }
  }

  .gs__non-clickable-step {
    color: #62778b75;
  }

  .gs__steps-list__content {
    margin-top: 23px;
    margin-bottom: 2px;
    overflow-y: hidden;
    display: flex;

    .gs__panel {
      flex: 3 1 auto;
      min-width: 0;
      display: -ms-flexbox;
      display: flex;
      min-height: 0;
      -ms-flex-direction: column;
      flex-direction: column;
      position: relative;
      background-color: #fff;
      border: 1px solid rgba(141, 162, 181, 0.28);
      border-radius: 8px;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);

      .gs__panel-body {
        flex: 1 1 auto;
        min-height: 0;
        position: relative;
        min-width: 0;
        padding: 24px 32px;
      }

      .gs__panel-footer {
        flex: 0 0 auto;
        border-top: 1px solid #eaeff4;
        display: flex;
        justify-content: flex-end;
        min-width: 0;
        padding: 24px 32px;
      }
    }
    .gs__details {
      flex: 1 2 auto;
      min-width: 0;
      margin-left: 48px;
      width: 304px;
      color: #8da2b5;
    }
  }

  .publish-info {
    margin-bottom: 1.5em;
  }

  @media (max-width: 1100px) {
    .gs__details {
      display: none;
    }
    .publish-info {
      visibility: hidden;
    }
  }
`;

export default GuidedStepsWrapper;
