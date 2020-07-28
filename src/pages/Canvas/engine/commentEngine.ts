import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import * as Thread from '@/ducks/thread';
import { Pair, Point } from '@/types';

import { NewCommentAPI } from '../types';
import { EngineConsumer } from './utils';

class CommentEngine extends EngineConsumer {
  log = this.engine.log.child('comment');

  focusTarget: string | null = null;

  target: string | null = null;

  isCreating = false;

  newComment: NewCommentAPI | null = null;

  get hasFocus() {
    return !!this.focusTarget;
  }

  get hasTarget() {
    return !!this.target;
  }

  isFocused(threadID: string) {
    return this.focusTarget === threadID;
  }

  registerNewComment(newComment: NewCommentAPI | null) {
    this.newComment = newComment;

    this.log.debug(this.log.init(newComment ? 'registered' : 'expired'), this.log.value('<NewCommentThread>'));
  }

  async setFocus(threadID: string | null) {
    if (threadID === this.focusTarget) return;

    this.log.debug(this.log.pending('setting comment focus'));
    this.reset();

    this.focusTarget = threadID;

    if (threadID) {
      await this.dispatch(Thread.loadThreads(this.select(Skill.activeProjectIDSelector)));
      this.redrawThread(threadID);
      this.log.info(this.log.success('set comment focus'), this.log.slug(threadID));
    }
  }

  setTarget(threadID: string | null) {
    if (threadID === this.target) return;

    this.log.debug(this.log.pending('setting comment target'));
    this.resetTarget();

    this.target = threadID;

    if (threadID) {
      this.redrawThread(threadID);
      this.log.info(this.log.success('set comment target'), this.log.slug(threadID));
    }
  }

  async enable() {
    await this.dispatch(Router.goToCurrentCanvasCommenting());
  }

  async disable() {
    this.reset();

    await this.dispatch(Router.goToCurrentCanvas());
  }

  createComment = this.bind(Thread.createComment);

  updateComment = this.bind(Thread.updateComment);

  deleteComment = this.bind(Thread.deleteComment);

  resolveThread = this.bind(Thread.resolveThread);

  startThread() {
    if (this.hasTarget) return;

    this.reset();

    this.isCreating = true;
    this.newComment?.show(this.engine.getMouseCoords());
    this.log.info(this.log.pending('started new comment'));
  }

  thread(threadID: string) {
    return this.engine.threads.get(threadID)?.api;
  }

  async addNewThread(origin: Point, nodeID: string | null, text: string, mentions: number[]) {
    const thread = await this.dispatch(Thread.createThread({ nodeID, position: origin, data: { text, mentions } }));

    this.setFocus(thread.id);
  }

  async translateThread(threadID: string, movement: Pair<number>) {
    if (!this.engine.threads.has(threadID)) return;

    this.thread(threadID)?.instance?.translate?.(movement);
  }

  async dragThread(threadID: string, movement: Pair<number>) {
    await this.translateThread(threadID, movement);
  }

  centerThread(threadID: string) {
    const center = this.thread(threadID)?.instance?.getCenterPoint();

    if (!center) return;

    this.engine.center(center);

    this.log.info('centered canvas on thread', this.log.slug(threadID));
  }

  redrawThread(threadID: string) {
    this.engine.dispatcher.redrawThread(threadID);
  }

  resetTarget() {
    const target = this.target;
    if (target) {
      this.target = null;
      this.redrawThread(target);
    }
  }

  resetCreating() {
    if (!this.isCreating) return;

    this.isCreating = false;
    this.newComment?.hide();
    this.log.info(this.log.reset('reset new comment'));
  }

  reset() {
    this.resetCreating();
    this.resetTarget();

    const focusTarget = this.focusTarget;
    if (!focusTarget) return;

    this.log.debug(this.log.pending('resetting comment target'), this.log.slug(focusTarget));
    this.focusTarget = null;

    this.redrawThread(focusTarget);

    this.log.info(this.log.reset('reset comment target'), this.log.slug(focusTarget));
  }
}

export default CommentEngine;
