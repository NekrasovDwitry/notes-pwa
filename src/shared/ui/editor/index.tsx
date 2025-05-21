import { useEditor, EditorContent } from "@tiptap/react";
import { Editor as TipTapEditor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { useCallback } from "react";
import styles from "./styles.module.scss";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#fef08a" },
  { name: "Green", value: "#86efac" },
  { name: "Blue", value: "#93c5fd" },
  { name: "Pink", value: "#fbcfe8" },
  { name: "Orange", value: "#fdba74" },
];

export function Editor({ content, onChange }: EditorProps) {
  const handleUpdate = useCallback(
    ({ editor }: { editor: TipTapEditor }) => {
      onChange(editor.getHTML());
    },
    [onChange],
  );

  const handleCreate = ({ editor }: { editor: TipTapEditor }) => {
    if (!content) {
      editor.chain().focus().setHeading({ level: 1 }).toggleBold().run();
    }
  };

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 3, 5],
      }),
      Bold,
      Italic,
      Underline,
      Strike,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      ListItem,
      BulletList,
      OrderedList,
    ],
    content,
    autofocus: "end",
    onUpdate: handleUpdate,
    onCreate: handleCreate,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${styles.button} ${editor.isActive("bold") ? styles.active : ""}`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${styles.button} ${editor.isActive("italic") ? styles.active : ""}`}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${styles.button} ${editor.isActive("underline") ? styles.active : ""}`}
          >
            Underline
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${styles.button} ${editor.isActive("strike") ? styles.active : ""}`}
          >
            Strike
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`${styles.button} ${editor.isActive("heading", { level: 1 }) ? styles.active : ""}`}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`${styles.button} ${editor.isActive("heading", { level: 3 }) ? styles.active : ""}`}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={`${styles.button} ${editor.isActive("heading", { level: 5 }) ? styles.active : ""}`}
          >
            H5
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`${styles.button} ${editor.isActive("paragraph") ? styles.active : ""}`}
          >
            P
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${styles.button} ${editor.isActive("bulletList") ? styles.active : ""}`}
          >
            Bullet List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${styles.button} ${editor.isActive("orderedList") ? styles.active : ""}`}
          >
            Numbered List
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => {
                if (editor.isActive("highlight", { color: color.value })) {
                  editor.chain().focus().unsetHighlight().run();
                } else {
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: color.value })
                    .run();
                }
              }}
              className={`${styles.button} ${styles.colorButton} ${editor.isActive("highlight", { color: color.value }) ? styles.active : ""}`}
              style={{ backgroundColor: color.value }}
              title={`Highlight ${color.name}`}
            />
          ))}
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`${styles.button} ${editor.isActive({ textAlign: "left" }) ? styles.active : ""}`}
          >
            Left
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`${styles.button} ${editor.isActive({ textAlign: "center" }) ? styles.active : ""}`}
          >
            Center
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`${styles.button} ${editor.isActive({ textAlign: "right" }) ? styles.active : ""}`}
          >
            Right
          </button>
        </div>
      </div>
      <EditorContent editor={editor} className={styles.content} />
    </div>
  );
}
