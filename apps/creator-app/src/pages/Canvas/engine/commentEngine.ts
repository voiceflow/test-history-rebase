import { Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { createMatchSelector } from 'connected-react-router';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';
import * as Account from '@/ducks/account';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { waitAsync } from '@/ducks/utils';
import { CommentDraftValue, NewCommentAPI } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';
import { Coords } from '@/utils/geometry';

import { EngineConsumer, getNodeCandidates, NodeCandidate } from './utils';

class CommentEngine extends EngineConsumer<{ newComment: NewCommentAPI }> {
  log = this.engine.log.child('comment');

  candidates: NodeCandidate[] = [];

  focusTarget: string | null = null;

  focusTargetComment: string | null = null;

  dragTarget: string | null = null;

  target: string | null = null;

  targetNodeID: string | null = null;

  isCreating = false;

  internal = {
    translateThread: (threadID: string, movement: Pair<number>) => {
      if (!this.engine.canvas) return null;

      const thread = this.thread(threadID);

      if (!thread?.instance) return null;

      return thread.instance.translate(this.engine.canvas.toVector(movement));
    },
  };

  get isModeActive() {
    return !!this.select(createMatchSelector(Path.CANVAS_COMMENTING));
  }

  get isVisible() {
    return this.select(UI.selectors.isCommentsVisible);
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

  getNewOrigin(): Coords | null {
    return this.components.newComment?.getOrigin() ?? null;
  }

  getNewDraftValue(): CommentDraftValue | null {
    return this.components.newComment?.getDraft() ?? null;
  }

  setNewDraftValue(draft: CommentDraftValue) {
    this.components.newComment?.setDraft(draft);
  }

  getFocusedDraftValue(): CommentDraftValue | null {
    if (!this.focusTarget) return null;

    return this.thread(this.focusTarget)?.instance?.getDraft() ?? null;
  }

  setFocusedDraftValue(draft: CommentDraftValue) {
    if (this.focusTarget) {
      this.thread(this.focusTarget)?.instance?.setDraft(draft);
    }
  }

  async setFocus(threadID: string, options?: { center?: boolean; commentID?: string }) {
    if (threadID === this.focusTarget) return;

    const projectID = this.select(Session.activeProjectIDSelector);

    if (!projectID) return;

    this.log.debug(this.log.pending('setting comment focus'));

    this.reset();

    this.focusTarget = threadID;
    this.focusTargetComment = options?.commentID ?? null;

    const diagramID = this.engine.getDiagramID();
    const thread = this.select(Designer.Thread.selectors.getOneByID)({ id: threadID });

    if (!thread) return;

    if (thread.diagramID !== diagramID) {
      await this.dispatch(Router.goToDiagramCommenting(thread.diagramID, threadID, options?.commentID));

      return;
    }

    this.dispatch(Router.goToCurrentCanvasCommenting(threadID, options?.commentID));

    if (options?.center) {
      await this.centerThread(threadID);
    }

    this.redrawThread(threadID);

    this.log.info(this.log.success('set comment focus'), this.log.slug(threadID));
  }

  async setFocusComment(commentID: string | null) {
    if (!this.focusTarget) return;

    this.focusTargetComment = commentID;
    this.dispatch(Router.goToCurrentCanvasCommenting(this.focusTarget, commentID ?? undefined));
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

  createComment = (threadID: string, comment: Realtime.NewComment) => {
    this.dispatch(Designer.Thread.ThreadComment.effect.createOne(threadID, comment));
  };

  updateComment = (commentID: string, comment: Realtime.NewComment) => {
    this.dispatch.partialSync(
      Designer.Thread.ThreadComment.action.PatchOne({ id: commentID, context: this.engine.context, patch: comment })
    );
  };

  deleteComment = (commentID: string) => {
    this.dispatch(Designer.Thread.ThreadComment.effect.deleteOne(commentID));
  };

  resolveThread = (threadID: string) => {
    this.dispatch.partialSync(
      Actions.Thread.PatchOne({ context: this.engine.context, id: threadID, patch: { resolved: true } })
    );
  };

  unresolveThread = (threadID: string) => {
    this.dispatch.partialSync(
      Actions.Thread.PatchOne({ context: this.engine.context, id: threadID, patch: { resolved: false } })
    );
  };

  startThread() {
    if (this.hasTarget) return;

    this.reset({ syncURL: true });

    const coords = this.engine.getMouseCoords().onPlane(this.engine.canvas!.getPlane());

    this.renewThread(coords);

    this.log.info(this.log.pending('started new comment'));
  }

  renewThread(coords: Coords) {
    this.isCreating = true;
    this.generateCandidates();
    this.updateCandidates(coords);
    this.components.newComment?.show(coords);
  }

  generateCandidates() {
    if (!this.isModeActive && !this.isVisible) return;

    this.candidates = getNodeCandidates(
      [...this.engine.getRootNodeIDs(), ...this.select(CreatorV2.stepIDsSelector)].reverse(),
      this.engine
    );
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

    let position: Point;
    const nodeID = this.targetNodeID || null;
    if (nodeID) {
      // account for zoom / panning after placing the comment
      const originRelativeToPlane = origin.onPlane(this.engine.canvas!.getPlane());
      const offset = this.getCoordsRelativeToNode(originRelativeToPlane, nodeID);
      if (!offset) return;

      position = offset;
    } else {
      position = this.engine.canvas!.fromCoords(origin);
    }

    const { projectID, diagramID } = this.engine.context;
    const creatorID = this.engine.select(Account.userIDSelector)!;

    const threadData: Actions.Thread.CreateData = {
      nodeID: this.targetNodeID,
      position,
      resolved: false,
      comments: [{ text, mentions, authorID: creatorID }],
      diagramID,
      assistantID: projectID,
    };

    const { data: thread } = await this.dispatch(
      waitAsync(Actions.Thread.CreateOne, { data: threadData, context: this.engine.context })
    );

    this.setFocus(thread.id);

    this.resetCreating();
  }

  translateThread(threadID: string, movement: Pair<number>) {
    return this.internal.translateThread(threadID, movement);
  }

  translateManyOnOrigins(threadIDs: string[], movement: Pair<number>, origins: Point[]) {
    threadIDs.forEach((threadID, i) => {
      if (!this.engine.canvas) return;

      const coords = this.engine.threads
        .get(threadID)
        ?.api.instance?.getCoords()
        .onPlane(this.engine.canvas.getPlane());
      const origin = origins[i];

      if (coords) {
        this.internal.translateThread(threadID, [
          movement[0] - (coords.point[0] - origin[0]),
          movement[1] - (coords.point[1] - origin[1]),
        ]);
      }
    });
  }

  translateDetachedThreads(threadIDs: string[], movement: Pair<number>) {
    const detachedThreads = this.engine
      .select(Designer.Thread.selectors.allByIDs, { ids: threadIDs })
      .filter((thread) => !thread.nodeID && this.engine.threads.has(thread.id));

    const activeThreadIDs = detachedThreads.map((thread) => thread.id);
    const origins = activeThreadIDs.map<Point>((threadID) => {
      const coords = this.engine.threads
        .get(threadID)!
        .api.instance!.getCoords()
        .onPlane(this.engine.canvas!.getPlane())!;

      return coords.point;
    });

    activeThreadIDs.forEach((threadID) => this.translateThread(threadID, movement));

    this.engine.io.threadDragMany(activeThreadIDs, movement, origins);
  }

  dragThread(threadID: string, movement: Pair<number>) {
    if (!this.engine.canvas) return;

    if (!this.dragTarget) {
      this.dragTarget = threadID;
      this.generateCandidates();
    }

    const originalCoords = this.engine.threads
      .get(threadID)
      ?.api.instance?.getCoords()
      .onPlane(this.engine.canvas.getPlane());

    const coords = this.translateThread(threadID, movement);

    if (!coords) return;

    this.updateCandidates(coords);

    if (!originalCoords) return;

    this.engine.io.threadDragMany([threadID], movement, [originalCoords.point]);
  }

  async dropThread() {
    const threadID = this.dragTarget;
    if (!threadID) return;

    const { targetNodeID } = this;
    const thread = this.thread(threadID);

    this.dragTarget = null;
    this.candidates = [];
    this.resetNodeTarget();

    if (!thread?.instance) return;

    const coords = thread.instance.getCoords().onPlane(this.engine.canvas!.getPlane());

    let position = coords.point;

    if (targetNodeID) {
      const offset = this.getCoordsRelativeToNode(coords, targetNodeID);
      if (!offset) return;
      position = offset;
    }

    const nodeID = targetNodeID || null;

    await this.dispatch.partialSync(
      Actions.Thread.PatchOne({ context: this.engine.context, id: threadID, patch: { nodeID, position } })
    );

    this.log.debug('location saved', this.log.slug(threadID));
  }

  async saveDetachedThreadsLocations(threadIDs: Nullish<string>[]) {
    const threads = threadIDs.reduce<Record<string, [number, number]>>((acc, threadID) => {
      if (!threadID || this.engine.getThreadByID(threadID)?.nodeID) return acc;

      const coords = this.engine.threads
        .get(threadID)
        ?.api.instance?.getCoords()
        .onPlane(this.engine.canvas!.getPlane());

      if (!coords) return acc;

      acc[threadID] = coords.point;

      return acc;
    }, {});

    if (!Object.keys(threads).length) return;

    await this.dispatch.partialSync(Actions.Thread.MoveMany({ context: this.engine.context, data: threads }));
  }

  async moveThreadToCanvas(threadID: string) {
    const thread = this.select(Designer.Thread.selectors.getOneByID)({ id: threadID });

    if (!thread?.nodeID) return;

    const node = this.engine.node.api(thread.nodeID);

    if (!node?.instance?.isReady()) return;

    const anchorCoords = node.instance.getThreadAnchorCoords()!;
    const coords = anchorCoords.add(thread.position);

    await this.dispatch.partialSync(
      Actions.Thread.PatchOne({
        context: this.engine.context,
        id: threadID,
        patch: { nodeID: null, position: coords.point },
      })
    );

    this.log.debug('new thread location saved', this.log.slug(threadID));
  }

  async handleNodesDelete(nodeIDs: string[]) {
    const threadIDs = nodeIDs.flatMap(this.select(Designer.Thread.selectors.getIDsByNodeID));

    await Promise.all(threadIDs.map((threadID) => this.moveThreadToCanvas(threadID)));
  }

  async centerThread(threadID: string) {
    const threadInstance = this.thread(threadID)?.instance;
    if (!threadInstance) return;

    this.engine.center(this.engine.canvas!.fromCoords(threadInstance.getCoords()), false);
    this.forceRedrawAllThreads();

    this.log.info(this.log.success('centered canvas on thread'), this.log.slug(threadID));
  }

  forceRedrawThreads(threadIDs: string[]) {
    if (!threadIDs.length || !this.engine.canvas) return;
    if (!this.isModeActive && !this.isVisible) return;

    const plane = this.engine.canvas.getOuterPlane();
    const threads = this.select(Designer.Thread.selectors.allByIDs, { ids: threadIDs });

    threads.forEach(({ id, position, nodeID }) => {
      const thread = this.thread(id);

      this.engine.comment.redrawThread(id);
      thread?.instance?.forceRedraw(thread.calculateCoordinates(position, nodeID).onPlane(plane));
    });
  }

  forceRedrawAllThreads() {
    if (!this.isModeActive && !this.isVisible) return;

    const threadIDs = this.select(Designer.Thread.selectors.allOpenedIDsForActiveDiagram);

    this.forceRedrawThreads(threadIDs);
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
    const { target } = this;
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

  reset(options?: { syncURL?: boolean }) {
    this.resetCreating();
    this.resetTarget();

    this.dragTarget = null;

    const { focusTarget } = this;

    if (!focusTarget) return;

    if (options?.syncURL) {
      this.dispatch(Router.goToCurrentCanvasCommenting());
    }

    this.log.debug(this.log.pending('resetting comment target'), this.log.slug(focusTarget));
    this.focusTarget = null;
    this.focusTargetComment = null;

    this.redrawThread(focusTarget);

    this.log.info(this.log.reset('reset comment target'), this.log.slug(focusTarget));
  }
}

export default CommentEngine;
