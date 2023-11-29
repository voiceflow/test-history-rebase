import { Box, Button, CodeEditor, Collapsible, CollapsibleHeader, ProgressBar, Scroll, Text, UploadArea } from '@voiceflow/ui-next';
import React from 'react';

import { designerClient } from '@/client/designer';

import { collapseContainerStyle, nestedCollapseContainerStyle } from './TestCMSIntentsEntitiesMigration.css';

interface Result {
  diff: { slots: any; intents: any };
  file: File;
  success: boolean;
  errorMessage?: boolean;
}

class TestRunner {
  private canceled = false;

  constructor(private files: File[] = [], private onProcess: (data: Result) => void) {}

  private async runFile(file: File) {
    try {
      const result = await designerClient.assistant.testCMSIntentsAndEntitiesMigrationFile({ file });

      if (this.canceled) {
        return;
      }

      this.onProcess({ ...result, file });
    } catch (err) {
      this.onProcess({ success: false, file, diff: { slots: null, intents: null }, errorMessage: (err as any).message ?? 'Test request failed' });
    }
  }

  async run(chunkSize = 7) {
    const files = this.files.slice(chunkSize);

    return new Promise<void>((resolve, reject) => {
      const callback = () => {
        if (this.canceled) {
          reject();
          return;
        }

        if (files.length === 0) {
          resolve();

          return;
        }

        this.runFile(files.shift()!).then(callback);
      };

      this.files.slice(0, chunkSize).forEach((file) => this.runFile(file).then(callback));
    });
  }

  cancel() {
    this.files = [];
    this.canceled = true;
    this.onProcess = () => {};
  }
}

const DiffCodeEditor = ({ value }: { value: any[] }) => {
  return <CodeEditor language="json" value={React.useMemo(() => [JSON.stringify(value)], [value])} theme="dark" />;
};

export const TestCMSIntentsEntitiesMigration = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [testing, setTesting] = React.useState(false);
  const [results, setResults] = React.useState<Result[]>([]);
  const runner = React.useRef<TestRunner | null>(null);

  const onUpload = async (files: File[]) => {
    runner.current?.cancel();

    setFiles(files);
    setResults([]);
    setTesting(true);

    runner.current = new TestRunner(files, (result) => setResults((prev) => [...prev, result]));

    await runner.current.run();

    setTesting(false);
  };

  const onCancel = () => {
    runner.current?.cancel();

    setTesting(false);
  };

  const finished = !!files.length && files.length === results.length;
  const succeededResults = React.useMemo(() => results.filter((r) => r.success), [results]);

  return (
    <Box width="100%" height="100%" direction="column" px={20} py={20} style={{ background: '#fff' }}>
      <Box width="100%" align="center" direction="column" gap={24}>
        <Text variant="h4">Intents/Entities migration test</Text>

        <UploadArea
          files={files.length === 0 ? undefined : files}
          label="Upload .vf files"
          testID="upload-form"
          maxFiles={100}
          onUpload={onUpload}
          isLoading={testing}
          acceptedFileTypes={{ 'vf/*': ['.vf'] }}
          onCloseButtonClick={() => setFiles([])}
        />

        {testing && (
          <Box testID="test-progress" align="center" direction="row" gap={12} width="300px">
            <ProgressBar value={(results.length / files.length) * 100} />

            <Text style={{ whiteSpace: 'nowrap' }} variant="caption">{`${results.length} / ${files.length}`}</Text>

            <Button onClick={onCancel} size="small" color="secondary">
              Cancel
            </Button>
          </Box>
        )}

        {finished && (
          <Text variant="h4" testID="test-result">
            {succeededResults.length === files.length
              ? `all ${results.length} tests succeeded:`
              : `${succeededResults.length} of ${results.length} tests succeeded:`}
          </Text>
        )}
      </Box>

      <Scroll testID="test-result-list" maxHeight="100%">
        {results.map((result, index) => (
          <Collapsible
            key={index}
            containerClassName={collapseContainerStyle}
            header={
              <Box style={{ position: 'sticky' }}>
                <CollapsibleHeader label={result.file.name}>
                  {() => (
                    <Text variant="caption" weight="bold" style={{ color: result.success ? 'green' : 'red', paddingLeft: '20px' }}>
                      {result.success ? 'Success' : 'Error'}
                    </Text>
                  )}
                </CollapsibleHeader>
              </Box>
            }
          >
            {result.success ? (
              <Text>No diff found</Text>
            ) : (
              <Box direction="column" gap={12}>
                {!!result.diff.intents && (
                  <Collapsible
                    header={<CollapsibleHeader label="Intents diff (click to show)" />}
                    showDivider={false}
                    containerClassName={nestedCollapseContainerStyle}
                  >
                    <DiffCodeEditor value={result.diff.intents} />
                  </Collapsible>
                )}

                {!!result.diff.slots && (
                  <Collapsible
                    header={<CollapsibleHeader label="Slots diff (click to show)" />}
                    showDivider={false}
                    containerClassName={nestedCollapseContainerStyle}
                  >
                    <DiffCodeEditor value={result.diff.slots} />
                  </Collapsible>
                )}

                {result.errorMessage && (
                  <Box>
                    <Text variant="fieldLabel">{result.errorMessage}</Text>
                  </Box>
                )}
              </Box>
            )}
          </Collapsible>
        ))}
      </Scroll>
    </Box>
  );
};
