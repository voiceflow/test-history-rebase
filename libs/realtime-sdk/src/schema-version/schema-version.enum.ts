export const SchemaVersion = {
  V1: 1,

  /**
   * migrate to the new portsV2 structure
   */
  V2: 2,

  /**
   * add missing ports to carousel steps to fix CT-582
   */
  V2_1: 2.1,

  /**
   * center align image markup nodes
   */
  V2_2: 2.2,

  /**
   * remove invalid entities from utterances in IMM
   */
  V2_3: 2.3,

  /**
   * force migrate
   */
  V2_4: 2.4,

  /**
   * migrate the "go to intent" and "url" node data into the "go to intent" and "url" action nodes
   */
  V2_5: 2.5,

  /**
   * migrate the set "value" type into the "advance" type
   */
  V2_6: 2.6,

  /**
   * migrate the block color and name for start blocks and blocks with the only intent step
   */
  V2_7: 2.7,

  /**
   * migrate to the topics and components
   */
  V3_0: 3.0,

  /**
   * adds root diagram id to topics
   */
  V3_1: 3.1,

  /**
   * restores version with a rootDiagramID that points to a non-existent diagram
   */
  V3_2: 3.2,

  /**
   * forces step data out of the ports for trace (custom action) step and into "paths" property
   */
  V3_3: 3.3,

  /**
   * adds missing components to versions component list so all components are visible in the menu
   */
  V3_4: 3.4,

  /**
   * migrate the old random step to random step v2
   */
  V3_5: 3.5,

  /**
   * renames intentStepIDs into menuNodeIDs and adds components and start nodes into it
   */
  V3_6: 3.6,

  /**
   * this migration transforms the cardV2 data structure
   */
  V3_7: 3.7,

  /**
   * this migration transforms card nodes into cardV2s
   */
  V3_8: 3.8,

  /**
   * migrates to domains
   */
  V3_9: 3.9,

  /**
   * migrates multiple templates diagrams into one
   */
  V3_91: 3.91,

  /** fixes ghost components */
  V3_92: 3.92,

  /** fixes duplicate intents and entities */
  V3_94: 3.94,

  /** refactor diagram.menuNodeIDs into diagram.menuItems */
  V3_95: 3.95,

  /** fix diagram.menuItems not defined */
  V3_96: 3.96,

  /** removes root diagram id from the components list */
  V3_97: 3.97,

  /**
   * migrate to the new portsV2 structure
   */
  V4_00: 4.0,

  /**
   * fixes the built-in version intent names
   */
  V4_01: 4.01,

  /**
   * removes duplicated port ids
   */
  V4_02: 4.02,

  /**
   * removes components from the topics menu
   */
  V4_03: 4.03,

  /**
   * cleans duplicate topicIDs from domains and duplicate menuItems from diagrams
   */
  V4_04: 4.04,

  /**
   * fixes card and carousel steps with filled next prots
   */
  V4_05: 4.05,

  /**
   * adds none intent to all VFNLU projects
   */
  V4_06: 4.06,

  /**
   * sync diagramIDs
   */
  V4_07: 4.07,

  /**
   * migrates project to assistant, migrates platform data slots and intents to cms resources
   */
  V5_00: 5.0,

  /**
   * migrates legacy variables to cms variables
   */
  V6_00: 6.0,

  /**
   * updates system variables description, adds VF_MEMORY system variable
   */
  V6_01: 6.01,

  /**
   * migrates legacy components to cms flows
   */
  V7_00: 7.0,

  /**
   * adds VF_CHUNKS system variable
   */
  V7_01: 7.01,

  /**
   * migrates deprecated KB steps to new format
   */
  V7_02: 7.02,

  /**
   * migrates domains and topics to workflows
   */
  V8_00: 8.0,

  /**
   * migrates intent steps to triggers
   */
  V9_00: 9.0,

  /**
   * migrates setV2 steps to new format with labels
   */
  V8_01: 8.01,
} as const;

export type SchemaVersion = (typeof SchemaVersion)[keyof typeof SchemaVersion];
