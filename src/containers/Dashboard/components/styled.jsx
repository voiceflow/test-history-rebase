import React from 'react';

import AvatarContainer from '@/components/Avatar/components/AvatarContainer';
import Link from '@/components/Link';
import { css, styled } from '@/hocs';

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

export const ProjectTitle = styled.div`
  margin-bottom: 1px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ProjectTitleCaption = styled(ProjectTitle)`
  color: #62778c;
  font-size: 13px;
  line-height: 1.5384615385;
`;

export const ProjectListDragZone = styled.div`
  height: 76px;
  background-color: #fff;
  background-image: url(/empty-state.svg);
  background-repeat: no-repeat;
  background-size: 10%;
  background-size: cover;
  border: 1px solid #eaeff4;
  border-radius: 7px;
`;

export const ProjectListItemActions = styled.div`
  display: none;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);
  transition: all 0.15s linear;
  border-radius: 50%;
  border: 1px solid #fff;
  color: #8da2b5;

  &:hover {
    color: #6e849a;
  }
`;

export const ProjectListItem = styled(({ isActive, ...props }) => <Link {...props} />)`
  display: flex;
  min-width: 0;
  padding: 15px 23px;
  background: #fff;
  border: 1px solid #eaeff4;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.12s linear, box-shadow 0.12s linear, border-color 0.12s linear;

  &:hover {
    background: #fff;
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
    display: none;
  }

  &:hover ${ProjectListItemActions} {
    display: flex;
  }

  ${({ hidden }) => hidden && 'visibility: hidden'}

  ${({ isActive }) =>
    isActive &&
    css`
      ${AvatarContainer} {
        display: none;
      }
      ${ProjectListItemActions} {
        display: flex;
        background: linear-gradient(#5d9df515, #5d9df530);
        color: #5b9dfa;
        box-shadow: 0 0 0 1px #5b9dfa99;
      }
    `}
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
