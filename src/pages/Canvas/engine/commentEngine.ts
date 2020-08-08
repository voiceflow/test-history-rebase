import { createMatchSelector } from 'connected-react-router';

import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import * as Thread from '@/ducks/thread';
import { Coords } from '@/utils/geometry';

import { NewCommentAPI } from '../types';
import { EngineConsumer } from './utils';

class CommentEngine extends EngineConsumer<{ newComment: NewCommentAPI }> {
  log = this.engine.log.child('comment');

  focusTarget: string | null = null;

  target: string | null = null;

  isCreating = false;

  get isActive() {
    return !!this.select(createMatchSelector(Path.CANVAS_COMMENTING));
  }

  get hasFocus() {
    return !!this.focusTarget;
  }

  get hasTarget() {
    return !!this.target;
  }

  isFocused(threadID: string) {
    return this.focusTarget === threadID;
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

  unresolveThread = this.bind(Thread.unresolveThread);

  startThread() {
    if (this.hasTarget) return;

    this.reset();

    this.isCreating = true;
    this.components.newComment?.show(this.engine.getMouseCoords().onPlane(this.engine.canvas!.getPlane()));
    this.log.info(this.log.pending('started new comment'));
  }

  thread(threadID: string) {
    return this.engine.threads.get(threadID)?.api;
  }

  async addNewThread(origin: Coords, nodeID: string | null, text: string, mentions: number[]) {
    const thread = await this.dispatch(Thread.createThread({ nodeID, position: this.engine.canvas!.fromCoords(origin), data: { text, mentions } }));

    this.setFocus(thread.id);
  }

  async dropThread(threadID: string) {
    const thread = this.thread(threadID);

    if (!thread?.instance) return;

    const coords = thread.instance.getCoords();
    await this.dispatch(Thread.updateThreadData(threadID, { position: this.engine.canvas!.fromCoords(coords) }));

    this.log.debug('location saved', this.log.slug(threadID));
  }

  centerThread(threadID: string) {
    const coords = this.thread(threadID)?.instance?.getCoords();

    if (!coords) return;

    this.engine.center(this.engine.canvas!.fromCoords(coords));

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
    this.components.newComment?.hide();
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
