declare module 'apl-viewhost-web' {
  import EventEmitter from 'eventemitter3';

  export const initEngine: () => Promise<void>;

  export namespace APL {
    export class Deletable {
      public delete(): void;
    }

    export class ImportRef {
      public version(): string;
      public name(): string;
    }

    export class ImportRequest {
      public isValid(): boolean;
      public reference(): ImportRef;
      public source(): string;
    }

    export class Content extends Deletable {
      public static create(document: string): Content;
      public getRequestedPackages(): Set<ImportRequest>;
      public addPackage(request: ImportRequest, data: string): void;
      public isError(): boolean;
      public isReady(): boolean;
      public isWaiting(): boolean;
      public addData(name: string, data: string): void;
      public getAPLVersion(): string;
      public getExtensionRequests(): Set<string>;
      public getExtensionSettings(uri: string): object;
    }

    export interface IMediaState {
      trackIndex: number;
      trackCount: number;
      currentTime: number;
      duration: number;
      paused: boolean;
      ended: boolean;
    }

    export class Rect {
      private constructor();
      public left: number;

      public top: number;

      public width: number;

      public height: number;
    }

    export class Component extends Deletable {
      public getCalculated(): {
        [key: number]: any;
      };
      public getCalculatedByKey<T>(key: number): T;
      public getDirtyProps(): {
        [key: number]: any;
      };
      public getType(): number;
      public getUniqueId(): string;
      public getId(): string;
      public getParent(): Component;
      public update(type: number, value: number): void;
      public pressed(): void;
      public updateScrollPosition(position: number): void;
      public updatePagerPosition(position: number): void;
      public updateMediaState(state: APL.IMediaState, fromEvent: boolean): void;
      public updateGraphic(json: string): void;
      public getChildCount(): number;
      public getChildAt(index: number): Component;
      public appendChild(child: Component): boolean;
      public insertChild(child: Component, index: number): boolean;
      public remove(): boolean;
      public inflateChild(data: string): Component;
      public getBoundsInParent(ancestor: Component): APL.Rect;
      public getGlobalBounds(): APL.Rect;
      public ensureLayout(): Promise<void> | void;
      public provenance(): string;
    }

    export enum GradientType {
      LINEAR = 0,
      RADIAL = 1,
    }

    export interface IGradient {
      angle: number;
      colorRange: number[];
      inputRange: number[];
      type: GradientType;
    }

    export interface TextMeasure {
      onMeasure(
        component: APL.Component,
        width: number,
        widthMode: number,
        height: number,
        heightMode: number
      ): {
        width: number;
        height: number;
      };
      onBaseline(component: APL.Component, width: number, height: number): number;
    }
    export interface IBackground {
      color: string;
      gradient: APL.IGradient | null;
    }

    export type DisplayMetricKind = 'counter' | 'timer';
    export interface DisplayMetric {
      kind: DisplayMetricKind;
      name: string;
      value: number;
    }

    export class Metrics extends Deletable {
      public static create(): Metrics;
      public size(width: number, height: number): Metrics;
      public dpi(dpi: number): Metrics;
      public theme(theme: string): Metrics;
      public shape(shape: string): Metrics;
      public mode(mode: string): Metrics;
    }

    export class ExtensionCommandDefinition {
      public static create(uri: string, name: string): ExtensionCommandDefinition;
      public allowFastMode(allowFastMode: boolean): ExtensionCommandDefinition;
      public requireResolution(requireResolution: boolean): ExtensionCommandDefinition;
      public property(property: string, defValue: any, required: boolean): ExtensionCommandDefinition;
      public arrayProperty(property: string, required: boolean): ExtensionCommandDefinition;
      public getURI(): string;
      public getName(): string;
      public getAllowFastMode(): boolean;
      public getRequireResolution(): boolean;
    }
    export class ExtensionEventHandler {
      public static create(uri: string, name: string): ExtensionEventHandler;
      public getURI(): string;
      public getName(): string;
    }

    export class RootConfig extends Deletable {
      public static create(environment: any): RootConfig;
      public utcTime(utcTime: number): RootConfig;
      public localTimeAdjustment(localTimeAdjustment: number): RootConfig;
      public registerExtensionEventHandler(handler: ExtensionEventHandler): RootConfig;
      public registerExtensionCommand(commandDef: ExtensionCommandDefinition): RootConfig;
      public registerExtensionEnvironment(uri: string, environment: any): RootConfig;
      public registerExtension(uri: string): RootConfig;
      public liveMap(name: string, obj: any): RootConfig;
      public liveArray(name: string, obj: any): RootConfig;
    }

    export class Action extends Deletable {
      public resolve(): void;
      public resolveWithArg(arg: number): void;
      public addTerminateCallback(callback: () => void): void;
      public then(callback: (action: Action) => void): void;
      public terminate(): void;
      public isPending(): boolean;
      public isTerminated(): boolean;
      public isResolved(): boolean;
    }

    export class Keyboard {
      private constructor();
      public code: string;

      public key: string;

      public repeat: boolean;

      public altKey: boolean;

      public ctrlKey: boolean;

      public metaKey: boolean;

      public shiftKey: boolean;
    }

    export class Context extends Deletable {
      public static create(
        options: any,
        text: TextMeasure,
        metrics?: APL.Metrics,
        content?: APL.Content,
        config?: APL.RootConfig,
        scalingOptions?: any
      ): Context;
      public topComponent(): APL.Component;
      public getTheme(): string;
      public getBackground(): APL.IBackground;
      public setBackground(background: APL.IBackground): void;
      public getVisualContext(): string;
      public clearPending(): void;
      public isDirty(): boolean;
      public clearDirty(): void;
      public getDirty(): string[];
      public getPendingErrors(): object[];
      public executeCommands(commands: string): Action;
      public invokeExtensionEventHandler(uri: string, name: string, data: string, fastMode: boolean): Action;
      public scrollToRectInComponent(component: APL.Component, x: number, y: number, width: number, height: number, align: number): void;
      public handleKeyboard(keyType: number, keyboard: APL.Keyboard): Promise<boolean>;
      public cancelExecution(): void;
      public hasEvent(): boolean;
      public popEvent(): Event;
      public screenLock(): boolean;
      public currentTime(): number;
      public nextTime(): number;
      public getViewportWidth(): number;
      public getViewportHeight(): number;
      public getScaleFactor(): number;
      public updateTime(currentTime: number, utcTime: number): number;
      public setLocalTimeAdjustment(offset: number): void;
      public updateCursorPosition(x: number, y: number): void;
      public handlePointerEvent(pointerEventType: number, x: number, y: number, pointerId: number, pointerType: number): boolean;
      public processDataSourceUpdate(payload: string, type: string): boolean;
      public handleDisplayMetrics(metrics: APL.DisplayMetric[]): void;
    }
  }

  export class Content {
    static create(doc: string): Content;
    content: APL.Content;
    private constructor();
    getRequestedPackages(): Set<APL.ImportRequest>;
    addPackage(request: APL.ImportRequest, data: string): void;
    isError(): boolean;
    isReady(): boolean;
    isWaiting(): boolean;
    addData(name: string, data: string): void;
    delete(): void;
  }

  export interface ILogger {
    trace(...msg: any[]): void;
    debug(...msg: any[]): void;
    info(...msg: any[]): void;
    warn(...msg: any[]): void;
    error(...msg: any[]): void;
  }

  export interface IGenericPropType {
    [key: number]: any;
  }

  export type FactoryFunction = (
    renderer: APLRenderer,
    component: APL.Component,
    parent?: Component,
    ensureLayout?: boolean,
    insertAt?: number
  ) => Component;

  export enum UpdateType {
    kUpdatePressed = 0,
    kUpdateTakeFocus = 1,
    kUpdatePressState = 2,
    kUpdateScrollPosition = 3,
    kUpdatePagerPosition = 4,
    kUpdatePagerByEvent = 5,
    kUpdateSubmit = 6,
    kUpdateTextChange = 7,
  }

  export abstract class Component<PropsType = IGenericPropType> extends EventEmitter {
    renderer: APLRenderer;

    component: APL.Component;

    protected factory: FactoryFunction;

    parent: Component;

    protected logger: ILogger;

    container: HTMLDivElement;

    children: Component[];

    props: IGenericPropType;

    bounds: APL.Rect;

    innerBounds: APL.Rect;

    id: string;

    assignedId: string;

    protected isDestroyed: boolean;

    protected state: {
      [UpdateType.kUpdatePagerPosition]: number;
      [UpdateType.kUpdatePressState]: number;
      [UpdateType.kUpdatePressed]: number;
      [UpdateType.kUpdateScrollPosition]: number;
      [UpdateType.kUpdateTakeFocus]: number;
    };

    protected executors: Map<PropertyKey, (props: PropsType) => void>;

    constructor(renderer: APLRenderer, component: APL.Component, factory: FactoryFunction, parent?: Component);
    init(): void;
    protected onPropertiesUpdated(): void;
    setProperties(props: PropsType): void;
    updateDirtyProps(): void;
    update(stateProp: UpdateType, value: number): void;
    destroy(destroyComponent?: boolean): void;
    static numberToColor(val: number): string;
    hasValidBounds(): boolean;
    inflateAndAddChild(index: number, data: string): Component | undefined;
    remove(): boolean;
    protected boundsUpdated(): void;
    protected isLayout(): boolean;
    protected alignSize(): void;
    protected propExecutor: (executor: () => void, ...props: PropertyKey[]) => any;

    protected getProperties(): PropsType;
    protected setTransform: () => void;

    protected setOpacity: () => void;

    protected setBoundsAndDisplay: () => void;

    protected setUserProperties: () => void;

    protected getCssShadow: () => string;

    private setShadow;

    protected applyCssShadow: (shadowParams: string) => void;
  }

  export type AudioPlayerWrapper = {};

  export interface IDeveloperToolOptions {
    mappingKey: string;
    writeKeys: string[];
  }

  export type ViewportShape = 'ROUND' | 'RECTANGLE';

  export interface IViewportCharacteristics {
    width: number;
    height: number;
    isRound: boolean;
    shape?: ViewportShape;
    dpi: number;
  }

  export enum AnimationQuality {
    kAnimationQualityNone = 0,
    kAnimationQualitySlow = 1,
    kAnimationQualityNormal = 2,
  }

  export interface IEnvironment {
    agentName: string;
    agentVersion: string;
    allowOpenUrl?: boolean;
    disallowVideo?: boolean;
    animationQuality?: AnimationQuality;
  }

  export enum PropertyKey {
    kPropertyScrollDirection = 0,
    kPropertyAccessibilityLabel = 1,
    kPropertyAlign = 2,
    kPropertyAlignItems = 3,
    kPropertyAlignSelf = 4,
    kPropertyAudioTrack = 5,
    kPropertyAutoplay = 6,
    kPropertyBackgroundColor = 7,
    kPropertyBorderBottomLeftRadius = 8,
    kPropertyBorderBottomRightRadius = 9,
    kPropertyBorderColor = 10,
    kPropertyBorderRadius = 11,
    kPropertyBorderRadii = 12,
    kPropertyBorderStrokeWidth = 13,
    kPropertyBorderTopLeftRadius = 14,
    kPropertyBorderTopRightRadius = 15,
    kPropertyBorderWidth = 16,
    kPropertyBottom = 17,
    kPropertyBounds = 18,
    kPropertyChildHeight = 19,
    kPropertyChildWidth = 20,
    kPropertyChecked = 21,
    kPropertyColor = 22,
    kPropertyColorKaraokeTarget = 23,
    kPropertyColorNonKaraoke = 24,
    kPropertyCurrentPage = 25,
    kPropertyDescription = 26,
    kPropertyDirection = 27,
    kPropertyDisabled = 28,
    kPropertyDisplay = 29,
    kPropertyDrawnBorderWidth = 30,
    kPropertyEntities = 31,
    kPropertyFastScrollScale = 32,
    kPropertyFilters = 33,
    kPropertyFocusable = 34,
    kPropertyFontFamily = 35,
    kPropertyFontSize = 36,
    kPropertyFontStyle = 37,
    kPropertyFontWeight = 38,
    kPropertyHandleTick = 39,
    kPropertyHighlightColor = 40,
    kPropertyHint = 41,
    kPropertyHintColor = 42,
    kPropertyHintStyle = 43,
    kPropertyHintWeight = 44,
    kPropertyGestures = 45,
    kPropertyGraphic = 46,
    kPropertyGrow = 47,
    kPropertyHandleKeyDown = 48,
    kPropertyHandleKeyUp = 49,
    kPropertyHeight = 50,
    kPropertyId = 51,
    kPropertyInitialPage = 52,
    kPropertyInnerBounds = 53,
    kPropertyItemsPerCourse = 54,
    kPropertyJustifyContent = 55,
    kPropertyKeyboardType = 56,
    kPropertyLeft = 57,
    kPropertyLetterSpacing = 58,
    kPropertyLineHeight = 59,
    kPropertyMaxHeight = 60,
    kPropertyMaxLength = 61,
    kPropertyMaxLines = 62,
    kPropertyMaxWidth = 63,
    kPropertyMediaBounds = 64,
    kPropertyMinHeight = 65,
    kPropertyMinWidth = 66,
    kPropertyNavigation = 67,
    kPropertyNotifyChildrenChanged = 68,
    kPropertyNumbered = 69,
    kPropertyNumbering = 70,
    kPropertyOnBlur = 71,
    kPropertyOnCancel = 72,
    kPropertyOnDown = 73,
    kPropertyOnEnd = 74,
    kPropertyOnFocus = 75,
    kPropertyOnMount = 76,
    kPropertyOnMove = 77,
    kPropertyOnPageChanged = 78,
    kPropertyOnPause = 79,
    kPropertyOnPlay = 80,
    kPropertyOnPress = 81,
    kPropertyOnScroll = 82,
    kPropertyOnSubmit = 83,
    kPropertyOnTextChange = 84,
    kPropertyOnUp = 85,
    kPropertyOnTimeUpdate = 86,
    kPropertyOnTrackUpdate = 87,
    kPropertyOpacity = 88,
    kPropertyOverlayColor = 89,
    kPropertyOverlayGradient = 90,
    kPropertyPaddingBottom = 91,
    kPropertyPaddingLeft = 92,
    kPropertyPaddingRight = 93,
    kPropertyPaddingTop = 94,
    kPropertyPosition = 95,
    kPropertyRight = 96,
    kPropertyScale = 97,
    kPropertyScrollPosition = 98,
    kPropertySecureInput = 99,
    kPropertySelectOnFocus = 100,
    kPropertyShadowColor = 101,
    kPropertyShadowHorizontalOffset = 102,
    kPropertyShadowRadius = 103,
    kPropertyShadowVerticalOffset = 104,
    kPropertyShrink = 105,
    kPropertySize = 106,
    kPropertySnap = 107,
    kPropertySource = 108,
    kPropertySpacing = 109,
    kPropertySpeech = 110,
    kPropertySubmitKeyType = 111,
    kPropertyText = 112,
    kPropertyTextAlign = 113,
    kPropertyTextAlignVertical = 114,
    kPropertyTrackCount = 115,
    kPropertyTrackCurrentTime = 116,
    kPropertyTrackDuration = 117,
    kPropertyTrackEnded = 118,
    kPropertyTrackIndex = 119,
    kPropertyTrackPaused = 120,
    kPropertyTransform = 121,
    kPropertyTransformAssigned = 122,
    kPropertyTop = 123,
    kPropertyUser = 124,
    kPropertyWidth = 125,
    kPropertyOnCursorEnter = 126,
    kPropertyOnCursorExit = 127,
    kPropertyLaidOut = 128,
    kPropertyValidCharacters = 129,
    kPropertyWrap = 130,
  }

  export interface IComponentProperties {
    [PropertyKey.kPropertyOpacity]: number;
    [PropertyKey.kPropertyBounds]: APL.Rect;
    [PropertyKey.kPropertyInnerBounds]: APL.Rect;
    [PropertyKey.kPropertyShadowHorizontalOffset]: number;
    [PropertyKey.kPropertyShadowVerticalOffset]: number;
    [PropertyKey.kPropertyShadowRadius]: number;
    [PropertyKey.kPropertyShadowColor]: number;
  }

  export enum VideoScale {
    kVideoScaleBestFill = 0,
    kVideoScaleBestFit = 1,
  }

  export enum AudioTrack {
    kAudioTrackBackground = 0,
    kAudioTrackForeground = 1,
    kAudioTrackNone = 2,
  }

  export interface IMediaSource {
    url: string;
    description: string;
    duration: number;
    repeatCount: number;
    offset: number;
  }

  export interface IVideoProperties extends IComponentProperties {
    [PropertyKey.kPropertyAudioTrack]: AudioTrack;
    [PropertyKey.kPropertyAutoplay]: boolean;
    [PropertyKey.kPropertyScale]: VideoScale;
    [PropertyKey.kPropertySource]: IMediaSource | IMediaSource[];
    [PropertyKey.kPropertyTrackCurrentTime]: number;
    [PropertyKey.kPropertyTrackIndex]: number;
  }

  export enum PlaybackState {
    IDLE = 'idling',
    LOADED = 'loaded',
    PLAYING = 'playing',
    ENDED = 'ended',
    PAUSED = 'paused',
    BUFFERING = 'buffering',
    ERROR = 'error',
  }

  export interface IMediaEventListener {
    onEvent(event: PlaybackState): void;
  }

  export enum CommandControlMedia {
    kCommandControlMediaPlay = 0,
    kCommandControlMediaPause = 1,
    kCommandControlMediaNext = 2,
    kCommandControlMediaPrevious = 3,
    kCommandControlMediaRewind = 4,
    kCommandControlMediaSeek = 5,
    kCommandControlMediaSetTrack = 6,
  }

  export abstract class AbstractVideoComponent extends Component<IVideoProperties> implements IMediaEventListener {
    protected constructor(renderer: APLRenderer, component: APL.Component, factory: FactoryFunction, parent?: Component);
    abstract onEvent(event: PlaybackState): void;

    abstract playMedia(source: IMediaSource | IMediaSource[], audioTrack: AudioTrack): any;

    abstract controlMedia(operation: CommandControlMedia, optionalValue: number): any;

    abstract play(waitForFinish?: boolean): any;

    abstract pause(): any;

    abstract next(): any;

    abstract previous(): any;

    abstract rewind(): any;

    abstract seek(offset: number): any;

    abstract setTrack(trackIndex: number): any;

    protected abstract setScale(scale: VideoScale): any;

    protected abstract setAudioTrack(audioTrack: AudioTrack): any;

    protected abstract setSource(source: IMediaSource | IMediaSource[]): any;

    protected abstract setTrackCurrentTime(trackCurrentTime: number): any;

    protected abstract setTrackIndex(trackIndex: number): any;

    private setScaleFromProp;

    private setAudioTrackFromProp;

    private setSourceFromProp;

    private setTrackCurrentTimeFromProp;

    private setTrackIndexFromProp;
  }

  export interface IVideoFactory {
    create(renderer: APLRenderer, component: APL.Component, factory: FactoryFunction, parent?: Component): AbstractVideoComponent;
  }

  export type DeviceMode = 'AUTO' | 'HUB' | 'MOBILE' | 'PC' | 'TV';

  export type SpeechMarkType = 'visime' | 'word' | 'sentence';
  export interface IBaseMarker {
    type: SpeechMarkType;
    time: number;
    value: string;
  }

  export interface IAudioEventListener {
    onPrepared(id: string): void;
    onMarker(id: string, markers: IBaseMarker[]): void;
    onPlaybackStarted(id: string): void;
    onPlaybackFinished(id: string): void;
    onError(id: string, reason: string): void;
  }

  export type AudioPlayerFactory = (eventListener: IAudioEventListener) => AudioPlayer;
  export abstract class AudioPlayer {
    private eventListener;

    private resourceMap;

    private currentSource;

    private decodePromise;

    private static logger;

    constructor(eventListener: IAudioEventListener);
    prepare(url: string, decodeMarkers: boolean): string;
    protected onPlaybackFinished(id: string): void;
    protected onError(id: string, reason: string): void;
    abstract play(id: string): any;
    protected playWithContext(id: string, audioContext: AudioContext): void;
    protected cancelPendingAndRemoveCompleted(): void;
    flush(): void;
  }

  export interface ISendEvent {
    source: any;
    arguments: string[];
    components: any[];
  }

  export interface IExtensionEvent {
    uri: string;
    name: string;
    source: any;
    params: any;
  }

  export interface IDataSourceFetchRequest {
    type: string;
    payload: any;
  }

  export interface IAPLOptions {
    environment: IEnvironment;
    theme: string;
    videoFactory?: IVideoFactory;
    view: HTMLElement;
    viewport: IViewportCharacteristics;
    mode?: DeviceMode;
    audioPlayerFactory?: AudioPlayerFactory;
    onSendEvent?: (event: ISendEvent) => void;
    onFinish?: () => void;
    onExtensionEvent?: (event: IExtensionEvent) => Promise<boolean>;
    onSpeakEventEnd?: (type: string) => void;
    onSpeakEventStart?: (type: string) => void;
    onDataSourceFetchRequest?: (event: IDataSourceFetchRequest) => void;
    onRunTimeError?: (pendingErrors: object[]) => void;
    onRequestGraphic?: (source: string) => Promise<string | undefined>;
    onOpenUrl?: (source: string) => Promise<boolean>;
    developerToolOptions?: IDeveloperToolOptions;
    utcTime: number;
    localTimeAdjustment: number;
  }

  export enum MeasureMode {
    Undefined = 0,
    Exactly = 1,
    AtMost = 2,
  }

  export default abstract class APLRenderer<Options = {}> {
    private mOptions;

    private static mappingKeyExpression;

    static create(options: IAPLOptions & { content: Content }): APLRenderer;

    protected logger: ILogger;

    componentByMappingKey: Map<string, Component>;

    context: APL.Context;

    top: Component;

    readonly options: Options;

    audioPlayer: AudioPlayerWrapper;

    protected constructor(mOptions: IAPLOptions);
    init(): void;
    private setBackground(docTheme);
    getDeveloperToolOptions(): IDeveloperToolOptions | undefined;
    onRunTimeError(pendingErrors: object[]): void;
    onMeasure(
      component: APL.Component,
      measureWidth: number,
      widthMode: MeasureMode,
      measureHeight: number,
      heightMode: MeasureMode
    ): {
      width: number;
      height: number;
    };
    onBaseline(component: APL.Component, width: number, height: number): number;
    destroy(): void;
    getBackgroundColor(): string;
    getComponentById(id: string): Component;
    screenLock(): boolean;
    stopUpdate(): Promise<void>;
    getComponentsByMappingKey(mappingKey: string): Map<string, Component>;
    addComponent(parent: Component, childIndex: number, componentData: string): Component | undefined;
    deleteComponent(component: Component): boolean;
    updateComponent(component: Component, componentData: string): Component | undefined;
    private getScreenCoords;

    private getTransformScale;

    private getViewportCoords;

    private onMouseMove;

    private onMouseLeave;

    private handleKeyDown;

    private handleKeyUp;

    private getKeyboard;
  }

  export interface RenderingOptionsPayload {
    legacyKaraoke: boolean;
  }
  export interface IComponentPayload {
    children: IComponentPayload[];
    id: string;
    type: number;
    [key: string]: any;
  }
  export interface MeasurePayload extends IComponentPayload {
    width: number;
    widthMode: number;
    height: number;
    heightMode: number;
  }
  export interface EventPayload {
    type: number;
    id: string;
    [key: string]: any;
  }
  export interface EventTerminatePayload {
    token: number;
  }
  export interface ScalingPayload {
    scaleFactor: number;
    viewportWidth: number;
    viewportHeight: number;
  }
  export interface BaselinePayload extends IComponentPayload {
    width: number;
    height: number;
  }
  export interface DocThemePayload {
    docTheme: string;
  }
  export interface BackgroundPayload {
    background: APL.IBackground;
  }
  export interface ScreenLockPayload {
    screenLock: boolean;
  }
  export interface IsCharacterValidPayload {
    componentId: string;
    messageId: string;
    valid: boolean;
  }
  export interface OnHandleKeyboardPayload {
    messageId: string;
    result: boolean;
  }

  export interface PayloadTypeMap {
    renderingOptions: RenderingOptionsPayload;
    measure: MeasurePayload;
    hierarchy: IComponentPayload;
    scaling: ScalingPayload;
    event: EventPayload;
    dirty: IComponentPayload[];
    eventTerminate: EventTerminatePayload;
    baseline: BaselinePayload;
    docTheme: DocThemePayload;
    background: BackgroundPayload;
    screenLock: ScreenLockPayload;
    ensureLayout: string;
    isCharacterValid: IsCharacterValidPayload;
    handleKeyboard: OnHandleKeyboardPayload;
  }

  export interface Message<Type extends keyof PayloadTypeMap> {
    type: Type;
    seqno: number;
    payload: PayloadTypeMap[Type];
  }

  export interface IAPLClientListener {
    onOpen?(): void;
    onClose?(): void;
    onError?(): void;
  }

  export abstract class APLClient {
    constructor();
    abstract sendMessage(message: any): any;
    addListener(listener: IAPLClientListener): void;
    removeListener(listener: IAPLClientListener): void;
    removeAllListeners(): void;
    protected isCharacterValid(message: Message<'isCharacterValid'>): void;
    protected handleKeyboard(message: Message<'handleKeyboard'>): void;
    onMessage<P extends keyof PayloadTypeMap>(message: Message<P>): void;
    protected onClose(): void;
    protected onOpen(): void;
    protected onError(): void;
  }
}
