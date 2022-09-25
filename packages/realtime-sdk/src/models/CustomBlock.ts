/**
 * v1 Custom Block implementation.
 *
 * Developed for the Custom Blocks MVP.
 */
export interface CustomBlock {
  /**
   * ID of the custom block
   */
  id: string;

  /**
   * Human-readable name for the custom block.
   */
  name: string;

  /**
   * The project that this custom block belongs to.
   */
  projectID: string;

  /**
   * The stringified JSON payload of the underlying custom action.
   */
  body: string;

  /**
   * The list of inferred parameters inside the JSON payload
   */
  parameters: string[];

  /**
   * Does Voiceflow execution stop on this block or not?
   */
  stop: boolean;

  /**
   * The list of path names for the underlying custom action.
   */
  paths: string[];

  /**
   * Index of the path in the `paths` field that is the default path.
   */
  defaultPath: number;
}
