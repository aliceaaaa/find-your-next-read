import { useRef, useEffect, useCallback } from 'react';
import styles from './rich-text-editor.module.scss';

type ToolbarItem = {
  command: string;
  label: string;
  title: string;
};

const TOOLBAR: ToolbarItem[] = [
  { command: 'bold', label: 'B', title: 'Bold' },
  { command: 'italic', label: 'I', title: 'Italic' },
  { command: 'underline', label: 'U', title: 'Underline' },
  { command: 'insertUnorderedList', label: '•—', title: 'Bullet list' },
  { command: 'insertOrderedList', label: '1.', title: 'Numbered list' },
];

type RichTextEditorProps = {
  initialValue?: string;
  label?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
};

export const RichTextEditor = ({
  initialValue = '',
  label,
  placeholder = 'Write something...',
  onChange,
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  const handleFormat = useCallback(
    (command: string) => {
      document.execCommand(command, false);
      editorRef.current?.focus();
      if (editorRef.current) {
        onChange?.(editorRef.current.innerHTML);
      }
    },
    [onChange],
  );

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  }, [onChange]);

  return (
    <div className={styles.editor}>
      {label && (
        <div className={styles.label} id="rte-label">
          {label}
        </div>
      )}
      <div className={styles.wrap}>
        <div
          className={styles.toolbar}
          role="toolbar"
          aria-label="Text formatting toolbar"
        >
          {TOOLBAR.map(({ command, label: btnLabel, title }) => (
            <button
              key={command}
              type="button"
              className={styles['toolbar-btn']}
              title={title}
              aria-label={title}
              data-command={command}
              onMouseDown={(e) => {
                e.preventDefault();
                handleFormat(command);
              }}
            >
              {btnLabel}
            </button>
          ))}
        </div>
        <div
          ref={editorRef}
          className={styles.content}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-labelledby={label ? 'rte-label' : undefined}
          aria-label={label ? undefined : 'Text editor'}
          data-placeholder={placeholder}
          onInput={handleInput}
          suppressContentEditableWarning
        />
      </div>
    </div>
  );
};
