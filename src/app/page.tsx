"use client";
import { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState, LexicalEditor } from 'lexical';

// Define the initial configuration for the Lexical editor with types
const initialConfig = {
  namespace: 'MyEditor',
  theme: {
    paragraph: 'my-2',
  },
  onError(error: Error) {
    console.error('Lexical editor error:', error);
  },
};

// A plugin to handle changes in the editor state
function MyOnChangePlugin({ onChange }: { onChange: (editorState: EditorState) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

export default function Home() {
  const [editorState, setEditorState] = useState<string>();

  function onChange(editorState: EditorState) {
    // Serialize the editor state to JSON and store it in the component state
    const editorStateJSON = editorState.toJSON();
    setEditorState(JSON.stringify(editorStateJSON));
  }

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="z-10 w-full max-w-5xl font-mono text-sm">
          <p className="mb-4 border-b border-gray-300 bg-gray-200 p-4 rounded-lg dark:border-neutral-800 dark:bg-zinc-800">
            Get started by editing <code className="font-mono font-bold">src/app/page.tsx</code>
          </p>

          <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
              <RichTextPlugin
                  contentEditable={<ContentEditable className="min-h-[150px] p-2 outline-none" />}
                  placeholder={<div className="opacity-50">Enter some text...</div>}
                  ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <MyOnChangePlugin onChange={onChange} />
            </div>
          </LexicalComposer>

          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100">
            <p className="font-bold">Editor State (Serialized):</p>
            <pre>{editorState || 'The editor state will appear here...'}</pre>
          </div>
        </div>
      </main>
  );
}

