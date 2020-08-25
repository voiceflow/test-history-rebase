import { createMatchSelector } from 'connected-react-router';

import { Path } from '@/config/routes';
import * as Creator from '@/ducks/creator';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import * as Thread from '@/ducks/thread';
import { Point } from '@/types';
import { Coords, Vector } from '@/utils/geometry';

import { NewCommentAPI } from '../types';
import { EngineConsumer, NodeCandidate, getCandidates } from './utils';

class CommentEngine extends EngineConsumer<{ newComment: NewCommentAPI }> {
  log = this.engine.log.child('comment');

  candidates: NodeCandidate[] = [];

  focusTarget: string | null = null;

  dragTarget: string | null = null;

  target: string | null = null;

  targetNodeID: string | null = null;

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

  isNodeTarget(nodeID: string) {
    return nodeID === this.targetNodeID;
  }

  activate() {
    return this.dispatch(Router.goToCurrentCanvasCommenting());
  }

  async setFocus(threadID: string | null) {
    if (threadID === this.focusTarget) return;

    this.log.debug(this.log.pending('setting comment focus'));
    this.reset();

    this.focusTarget = threadID;

    if (threadID) {
      await this.dispatch(Thread.loadThread(this.select(Skill.activeProjectIDSelector), threadID));
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

  createComment = this.bind(Thread.createComment);

  updateComment = this.bind(Thread.updateComment);

  deleteComment = this.bind(Thread.deleteComment);

  resolveThread = this.bind(Thread.resolveThread);

  unresolveThread = this.bind(Thread.unresolveThread);

  deleteThreadsByNodeIDs = this.bind(Thread.deleteThreadsByNodeIDs);

  startThread() {
    if (this.hasTarget) return;

    this.reset();

    const coords = this.engine.getMouseCoords().onPlane(this.engine.canvas!.getPlane());

    this.isCreating = true;
    this.generateCandidates();
    this.updateCandidates(coords);
    this.components.newComment?.show(coords);
    this.log.info(this.log.pending('started new comment'));
  }

  generateCandidates() {
    if (!this.isActive) return;

    this.candidates = getCandidates([...this.engine.getRootNodeIDs(), ...this.select(Creator.stepNodeIDsSelector)].reverse(), this.engine);
    this.log.debug('discovered thread target candidates', this.log.value(this.candidates.length));
  }

  updateCandidates(coords: Coords) {
    const point = coords.raw();
    const target = this.candidates.find(({ containsPoint }) => containsPoint(point));

    if (target && this.isNodeTarget(target.nodeID)) return;

    if (!target) {
      this.resetNodeTarget();
      return;
    }

    if (this.targetNodeID) {
      this.resetNodeTarget();
    }

    this.targetNodeID = target.nodeID;
    this.engine.node.redraw(target.nodeID);
    this.log.info(this.log.success('set thread target node'), this.log.value(target.nodeID));
  }

  thread(threadID: string) {
    return this.engine.threads.get(threadID)?.api;
  }

  getCoordsRelativeToNode(origin: Coords, nodeID: string): Point | null {
    const node = this.engine.node.api(nodeID);
    if (!node?.instance?.isReady()) return null;

    const anchorCoords = node.instance.getThreadAnchorCoords()!;

    return this.engine.canvas!.fromCoords(origin.sub(anchorCoords));
  }

  async addNewThread(text: string, mentions: number[]) {
    const origin = this.components.newComment!.getOrigin();

    if (!origin) return;

    if (this.targetNodeID) {
      const offset = this.getCoordsRelativeToNode(origin, this.targetNodeID);
      if (!offset) return;

      const thread = await this.dispatch(Thread.createThread({ nodeID: this.targetNodeID, position: offset, data: { text, mentions } }));

      this.resetCreating();
      this.setFocus(thread.id);

      return;
    }

    const thread = await this.dispatch(
      Thread.createThread({ nodeID: null, position: this.engine.canvas!.fromCoords(origin), data: { text, mentions } })
    );

    this.resetCreating();
    this.setFocus(thread.id);
  }

  translateThread(threadID: string, movement: Vector) {
    const thread = this.thread(threadID);

    if (!thread?.instance) return null;

    return thread.instance.translate(movement);
  }

  dragThread(threadID: string, movement: Vector) {
    if (!this.dragTarget) {
      this.dragTarget = threadID;
      this.generateCandidates();
    }

    const coords = this.translateThread(threadID, movement);
    if (!coords) return;

    this.updateCandidates(coords);
  }

  async dropThread() {
    const threadID = this.dragTarget;
    if (!threadID) return;

    const targetNodeID = this.targetNodeID;
    const thread = this.thread(threadID);

    this.dragTarget = null;
    this.candidates = [];
    this.resetNodeTarget();

    if (!thread?.instance) return;

    const coords = thread.instance.getCoords().onPlane(this.engine.canvas!.getPlane());
    if (targetNodeID) {
      const offset = this.getCoordsRelativeToNode(coords, targetNodeID);
      if (!offset) return;

      await this.dispatch(Thread.updateThreadData(threadID, { nodeID: targetNodeID, position: offset }));
    } else {
      await this.dispatch(Thread.updateThreadData(threadID, { nodeID: null, position: coords.point }));
    }

    this.log.debug('location saved', this.log.slug(threadID));
  }

  async centerThread(threadID: string) {
    const diagramID = this.engine.getDiagramID();
    const thread = this.select(Thread.threadByIDSelector)(threadID);

    if (thread.diagramID !== diagramID) {
      await this.dispatch(Router.goToDiagramCommenting(thread.diagramID, threadID));
      return;
    }

    const threadInstance = this.thread(threadID)?.instance;
    if (!threadInstance) return;

    this.engine.center(this.engine.canvas!.fromCoords(threadInstance.getCoords()), false);
    this.forceRedrawThreads();

    this.log.info(this.log.success('centered canvas on thread'), this.log.slug(threadID));
  }

  forceRedrawThreads() {
    if (!this.isActive) return;

    const plane = this.engine.canvas!.getOuterPlane();
    const threads = this.select(Thread.activeDiagramThreadsSelector);

    threads.forEach(({ id, position, nodeID }) => {
      const thread = this.thread(id);
      return thread?.instance?.forceRedraw(thread.calculateCoordinates(position, nodeID).onPlane(plane));
    });
  }

  redrawThread(threadID: string) {
    this.engine.dispatcher.redrawThread(threadID);
  }

  resetNodeTarget() {
    const nodeID = this.targetNodeID;
    if (nodeID) {
      this.targetNodeID = null;
      this.engine.node.redraw(nodeID);
      this.log.info(this.log.reset('cleared thread target node'), this.log.value(nodeID));
    }
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
    this.candidates = [];
    this.resetNodeTarget();
    this.components.newComment?.hide();
    this.log.info(this.log.reset('reset new comment'));
  }

  reset() {
    this.resetCreating();
    this.resetTarget();

    this.dragTarget = null;

    const focusTarget = this.focusTarget;
    if (!focusTarget) return;

    this.log.debug(this.log.pending('resetting comment target'), this.log.slug(focusTarget));
    this.focusTarget = null;

    this.redrawThread(focusTarget);

    this.log.info(this.log.reset('reset comment target'), this.log.slug(focusTarget));
  }
}

export default CommentEngine;
