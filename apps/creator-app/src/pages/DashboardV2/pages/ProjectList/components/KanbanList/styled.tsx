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
