import { fontResetStyle, listResetStyle } from '@voiceflow/ui';
import React from 'react';

import { Container as AvatarContainer } from '@/components/Avatar/styles';
import DragPlaceholder from '@/components/DragPlaceholder';
import EditableText from '@/components/EditableText';
import { css, styled } from '@/hocs/styled';

import Link, { LinkProps } from './Link';

export const ProjectNameWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-left: 16px;
`;

export const ProjectTitleDetails = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-content: flex-end;
  max-width: 175px;
  margin-top: -1px;
  margin-bottom: -1px;
`;

export const ProjectTitle = styled(EditableText)`
  display: block !important;
  margin-bottom: 1px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ProjectTitleCaption = styled.div`
  color: #62778c;
  font-size: 13px;
  line-height: 1.5384615385;
  margin-bottom: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProjectListDragZone = styled(DragPlaceholder)`
  height: 76px;
  background-color: #fff;
  border: 1px solid #eaeff4;
  border-radius: 7px;
`;

export const ProjectListItemActions = styled.div<{ active?: boolean; locked?: boolean }>`
  display: none;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);
  transition: all 0.15s linear;
  border-radius: 50%;
  border: 1px solid #fff;
  color: #8da2b5;

  &:hover {
    color: #6e849a;
  }

  ${({ active }) =>
    active &&
    css`
      display: flex;
      background: linear-gradient(#5d9df515, #5d9df530);
      color: #5b9dfa;
      box-shadow: 0 0 0 1px #5b9dfa99;

      &:hover {
        color: #5b9dfa;
      }
    `}

  ${({ locked }) =>
    locked &&
    css`
      display: flex;
      background: #fff;
      color: #8da2b5;
      box-shadow: 0 0 0 1px #8da2b599;

      &:hover {
        color: #8da2b5;
      }
    `}
`;

export interface ProjectListItemProps extends React.PropsWithChildren<LinkProps> {
  hidden?: boolean;
  locked?: boolean;
  tabIndex?: number;
  hasOptions: boolean;
}

export const ProjectListItem = styled(({ hasOptions, ...props }: ProjectListItemProps) => <Link {...props} />)`
  display: flex;
  min-width: 0;
  padding: 15px 23px;
  border: 1px solid #eaeff4;
  border-radius: 7px;
  cursor: ${({ locked }) => (locked ? 'default' : 'pointer')};
  transition: background-color 0.12s linear, box-shadow 0.12s linear, border-color 0.12s linear;

  &:hover {
    border-color: transparent;
    box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.06), 0 2px 4px 0 rgba(17, 49, 96, 0.12);
  }

  &:focus {
    outline: none;
    background: linear-gradient(-180deg, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.45));
    box-shadow: none;
    border: 1px solid #eaeff4;
  }

  &:hover ${AvatarContainer} {
    ${({ hasOptions }) => hasOptions && 'display: none'}
  }

  &:hover ${ProjectListItemActions} {
    display: flex;
  }

  ${({ hidden }) => hidden && 'visibility: hidden'}
`;

export const DropdownIconWrapper = styled.div`
  height: 42px;
  width: 42px;

  & > * {
    padding: 10px;
    height: inherit;
    width: inherit;
    align-items: center;
    justify-content: center;
  }
`;

export const ListContainer = styled.div`
  -ms-flex-direction: column;
  flex-direction: column;
  width: 384px;
  min-height: 118px;
  max-height: 100%;
  overflow: hidden;
  background-color: #fff;
  border-right: 1px solid #dfe3ed;
  cursor: grab;

  .main-list,
  .main-lists-inner {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    min-width: 0;
  }

  .main-list-header {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 0 0 auto;
    min-width: 0;
    padding: 16px 22px 10px 32px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .main-list-header__main {
    flex: 1 1 auto;
    min-width: 0;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .main-list-header__title {
    width: 100%;
    overflow: hidden;
    color: #132144;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .main-list-header__aside {
    flex: 0 0 auto;
    min-width: 0;
    margin-left: 18px;
  }

  .main-list-header.__scrolling {
    box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.08), 0 1px 3px 0 rgba(17, 49, 96, 0.08);
  }

  .main-list-body {
    -webkit-flex: 0 1 auto;
    -ms-flex: 0 1 auto;
    flex: 0 1 auto;
    min-width: 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-box-flex: 0;
    -webkit-overflow-scrolling: touch;
  }

  .main-list-body:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .main-list-body:last-child {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .main-list-body:last-child .main-list-body-inner {
    padding-bottom: 24px;
  }

  .main-list-body-inner {
    width: 384px;
    padding: 2px 32px;
  }

  .main-list-header + .main-list-footer {
    padding-top: 18px;
  }

  .main-list-footer {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex: 0 0 auto;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
    min-width: 0;
    min-height: 0;
    max-height: 80px;
    padding: 16px 32px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    -webkit-transition: -webkit-box-shadow 0.12s linear;
    -o-transition: box-shadow 0.12s linear;
    transition: -webkit-box-shadow 0.12s linear;
    transition: box-shadow 0.12s linear;
    transition: box-shadow 0.12s linear, -webkit-box-shadow 0.12s linear;
    -webkit-box-flex: 0;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
  }

  .main-list-footer.__scrolling {
    -webkit-box-shadow: 0 -1px 0 0 #eaeff4;
    box-shadow: 0 -1px 0 0 #eaeff4;
  }

  .main-list-footer-left {
    -webkit-box-flex: 1;
    -webkit-flex: 1 1 auto;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    min-width: 0;
  }

  .main-list-footer-center {
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1 1 auto;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    justify-content: center;
    min-width: 0;
  }

  .main-list-footer-right {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 auto;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    min-width: 0;
  }

  .project-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .project-list__list-item {
    margin-bottom: 12px;
    background-color: #fff;
    border-radius: 7px;
  }

  .main-list-body.still .project-list__item:active {
    margin-bottom: 12px;
    background: linear-gradient(-180deg, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.45));
    border: 1px solid #eaeff4 !important;
    border-radius: 8px;
    box-shadow: none !important;
  }

  .project-list__item {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    min-width: 0;
    padding: 15px 23px;
    background-color: #fff;
    border: 1px solid #eaeff4;
    border-radius: 7px;
    cursor: pointer;
    transition: background-color 0.12s linear, box-shadow 0.12s linear, border-color 0.12s linear;
  }

  .main-list-body.still .project-list__item:hover {
    background-color: #fff;
    border-color: transparent;
    -webkit-box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.06), 0 2px 4px 0 rgba(17, 49, 96, 0.12);
    box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.06), 0 2px 4px 0 rgba(17, 49, 96, 0.12);
  }

  .main-list-body.still .project-list__item:hover .project-list__item-image,
  .main-list-body.still .project-list__item.__is-hovered .project-list__item-image {
    display: none;
  }

  .project-list__item:hover .project-list__item-action {
    border: 1px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);
  }

  .main-list-body.still .project-list__item:hover .project-list__item-actions,
  .main-list-body.still .project-list__item.__is-hovered .project-list__item-actions {
    display: block;
  }

  .project-list__item-details {
    display: flex;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    flex-direction: column;
    align-content: flex-end;
    max-width: 170px;
    margin-top: -1px;
    margin-bottom: -1px;
  }

  .status-indicator {
    position: relative;
    display: inline-block;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #fff, 0 1px 2px 2px rgba(17, 49, 96, 0.16);
  }

  .project-list__item-status {
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    align-self: center;
    min-width: 0;
    margin-left: 16px;
    line-height: 1;
    -ms-flex-item-align: center;
  }

  .project-list__item-status .status-indicator {
    display: block;
  }

  .status-indicator::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    padding: 1px;
    background-clip: content-box;
    border-radius: 50%;
    content: '';
  }

  .project-list__item-caption {
    color: #8da2b5;
    font-weight: 300;
    font-size: 13px;
    line-height: 1.5384615385;
  }

  .borderless-input {
    padding: 0;
    letter-spacing: inherit;
    background: none;
    border: none;
    outline: none;
  }

  .hidden {
    display: none !important;
  }
`;

export const Input = styled.input`
  ${fontResetStyle};
`;

export const ProjectList = styled.ul`
  ${listResetStyle}
`;
