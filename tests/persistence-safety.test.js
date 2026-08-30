import test from 'node:test';
import assert from 'node:assert/strict';
import { Editor } from '../js/modules/editor.js';

function createMockDocument() {
  return {
    createDocumentFragment() {
      return {
        items: [],
        appendChild(node) {
          this.items.push(node);
        }
      };
    },
    createElement() {
      return {
        className: '',
        textContent: '',
        remove() {}
      };
    },
    getElementById() {
      return null;
    }
  };
}

function createMockTextarea() {
  return {
    value: '',
    selectionStart: 0,
    selectionEnd: 0,
    scrollTop: 0,
    classList: { toggle() {} },
    style: {},
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    setSelectionRange(start, end) {
      this.selectionStart = start;
      this.selectionEnd = end;
    }
  };
}

function createMockLineNumbers() {
  return {
    children: [],
    appendChild(fragment) {
      this.children.push(...fragment.items);
    },
    get lastElementChild() {
      return this.children[this.children.length - 1] || null;
    }
  };
}

test('Editor.setContent supports silent updates for non-persisted error states', () => {
  globalThis.document = createMockDocument();

  const changeEvents = [];
  const editor = new Editor({
    textarea: createMockTextarea(),
    lineNumbers: createMockLineNumbers(),
    onChange: (content) => changeEvents.push(content)
  });

  editor.setContent('persisted content');
  assert.equal(changeEvents.length, 1);
  assert.equal(changeEvents[0], 'persisted content');

  editor.setContent('read-only load error', { silent: true });

  assert.equal(editor.getContent(), 'read-only load error');
  assert.equal(changeEvents.length, 1);
  assert.equal(editor.undoStack.length, 0);
  assert.equal(editor.redoStack.length, 0);
});
