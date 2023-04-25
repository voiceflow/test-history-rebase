import { cancelIcon } from '@/assets';
import { css, styled } from '@/hocs/styled';

const GuidedStepsWrapper = styled.div<{ disabled?: boolean; centred?: boolean }>`
  max-width: 1040px;

  padding: 32px;

  ${({ centred = true }) =>
    centred &&
    css`
      margin-left: auto;
      margin-right: auto;
    `}

  .alert {
    margin-bottom: 15px;
  }

  .alert:last-child {
    margin-bottom: 0;
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

    .gs__is-constant {
      color: #62778c;
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
      color: #fff;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 8 7" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M2.93392736,4.160577 L7.08815759,0.137094346 C7.31579123,-0.0625550403 7.64460031,-0.0419946134 7.8499241,0.184727594 C8.0500253,0.40568292 8.0500253,0.76158459 7.8499241,0.982539917 L3.25221093,6.0594172 C2.84386528,6.51031978 2.17846245,6.51397506 1.7659921,6.06758151 C1.73992286,6.03936823 1.71522281,6.00968217 1.69199337,5.97864524 L0.12890688,3.89019962 C-0.055920774,3.64325071 -0.0403405209,3.28360157 0.165008085,3.05685196 C0.372006184,2.82828095 0.701591551,2.80187658 0.93686071,2.99501583 L2.14820594,4.160577 C2.43611018,4.39692591 2.65309537,4.40688478 2.93392736,4.160577 Z" id="path-1"></path></defs><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g fill="%23FFFFFF"><use xlink:href="%23path-1"></use><use xlink:href="%23path-1"></use></g></g></svg>');
      background-size: 8px 8px;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-color: #5d9df5;
      border-width: 0;
      display: inline-block;
      vertical-align: top;
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
      background: url(${cancelIcon});
      background-size: 8px 8px;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-color: #bd425f;
      border-width: 0;
      display: inline-block;
      vertical-align: top;
      padding: 4px;
      margin: 0;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
    &:after {
      background-color: #bd425f;
    }
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
    display: flex;

    .gs__panel {
      width: 60%;
      flex: 3 1 auto;
      width: 60%;
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
        border-top: 1px solid #dfe3ed;
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

  &[disabled] {
    .gs__panel-body {
      opacity: 0.4;
      pointer-events: none;
    }
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
