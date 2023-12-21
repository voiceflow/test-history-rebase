export interface ICMSKnowledgeBaseEditorContent {
  value: string | null;
  onBlur: VoidFunction;
  onValueChange: (value: string | null) => void;
}
