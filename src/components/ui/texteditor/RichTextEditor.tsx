// components/RichTextEditor.tsx
import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useRef(null);

  const config = {
    readonly: false,
    height: 400,
    uploader: { insertImageAsBase64URI: true },
    toolbarAdaptive: false,
  };

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      tabIndex={1}
      onBlur={newContent => onChange(newContent)} 
      onChange={() => {}} 
    />
  );
};

export default RichTextEditor;
