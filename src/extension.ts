// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const ExtensionFactory = (context: vscode.ExtensionContext, namespace: string = "") => {

	const registerCommand = (command: string, callback: (...args: any[]) => any, thisArg?: any) => {
		context.subscriptions.push(vscode.commands.registerCommand(namespace + "." + command, callback, thisArg));
	};

	const registerTextEditorCommand = (command: string, callback: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => void, thisArg?: any) => {
		context.subscriptions.push(vscode.commands.registerTextEditorCommand(namespace + "." + command, callback, thisArg));
	};

	return {
		registerCommand,
		registerTextEditorCommand
	};
};

const ContextFactory = (namespace: string = "") => {
	const cache: Map<string, boolean | string> = new Map();

	const set = async (key: string, value: boolean | string | undefined) => {
		key = namespace + "." + key;
		if (value === undefined) {
			cache.delete(key);
		} else {
			const prev = get(key);
			if (prev !== value) {
				cache.set(key, value);
			}
		}
		await vscode.commands.executeCommand('setContext', key, value);
	};

	const has = (key: string): boolean => {
		return cache.has(namespace + "." + key);
	};

	const get = (key: string): boolean | string | undefined => {
		return cache.get(namespace + "." + key);
	};

	return { set, has, get };
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "flying-fish" is now active!');

	const ExtFactory = ExtensionFactory(context, 'flying-fish');
	const StatusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	const StickyCache: Map<vscode.TextEditor, vscode.Position | undefined> = new Map();
	const CtxFactory = ContextFactory('flying-fish');

	context.subscriptions.push(StatusBarItem);

	const setSelection = (editor: vscode.TextEditor) => {
		const pos = StickyCache.get(editor);
		if (!pos) {
			return;
		}
		editor.selection = new vscode.Selection(pos, editor.selection.active);
	};

	const enableSticky = (editor: vscode.TextEditor) => {
		StickyCache.set(editor, editor.selection.active);
		CtxFactory.set("sticky", true);
	};

	const disableSticky = async (editor: vscode.TextEditor) => {
		if (StickyCache.has(editor)) {
			StickyCache.delete(editor);
		}
		CtxFactory.set("sticky", false);
		await vscode.commands.executeCommand('cancelSelection');
	};

	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection((event) => {
		if (StickyCache.has(event.textEditor) && event.textEditor.selection.isEmpty) {
			switch (event.kind) {
				case undefined:
					break;
				// keyboard
				case 1:
					break;
				// mouse
				case 2:
					setSelection(event.textEditor);
					break;
				// command
				case 3:
					break;
				default:
					break;
			}
		}
	}));

	ExtFactory.registerTextEditorCommand('insertComma', (editor, edit) => {
		edit.insert(editor.selection.active, ",");
	});

	ExtFactory.registerTextEditorCommand('enableSticky', enableSticky);

	ExtFactory.registerTextEditorCommand('disableSticky', disableSticky);

	ExtFactory.registerTextEditorCommand('toggleSticky', (editor, _) => {
		if (StickyCache.has(editor)) {
			disableSticky(editor);
		} else {
			enableSticky(editor);
		}
	});

	ExtFactory.registerTextEditorCommand('switchAnchorAndCursor', async (editor, _) => {
		if (editor.selection.isEmpty) {
			return;
		}

		let active = editor.selection.active;
		let anchor = editor.selection.anchor;

		editor.selection = new vscode.Selection(active, anchor);
		StickyCache.set(editor, active);
		CtxFactory.set("sticky", true);
	});

	ExtFactory.registerCommand('toggleFlyingFish', () => {
		if (CtxFactory.get('enabled')) {
			CtxFactory.set('enabled', false);
		} else {
			CtxFactory.set('enabled', true);
		}
	});

	ExtFactory.registerCommand('startLeadering', () => {
		CtxFactory.set("mode", "leadering");
		if (vscode.window.activeTextEditor) {
			StatusBarItem.text = "Flying Fish Leader";
			StatusBarItem.show();
		} else {
			StatusBarItem.hide();
		}
	});

	ExtFactory.registerCommand('stopLeadering', () => {
		CtxFactory.set("mode", "");
		if (StatusBarItem) {
			StatusBarItem.hide();
		}
	});

	ExtFactory.registerTextEditorCommand('cursorHome', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorHome${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorEnd', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorEnd${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorUp', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorUp${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorDown', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorDown${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorLeft', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorLeft${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorRight', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorRight${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorWordRight', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorWordRight${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorWordLeft', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorWordLeft${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorWordPartRight', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorWordPartRight${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorWordPartLeft', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorWordPartLeft${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorTop', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorTop${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorBottom', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorBottom${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorPageDown', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorPageDown${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerTextEditorCommand('cursorPageUp', async (editor, _) => {
		await vscode.commands.executeCommand(`cursorPageUp${StickyCache.has(editor) ? "Select" : ""}`);
	});

	ExtFactory.registerCommand('clipboardCopyAction', async () => {
		await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
		await vscode.commands.executeCommand('flying-fish.disableSticky');
	});

	ExtFactory.registerCommand('clipboardCutAction', async () => {
		await vscode.commands.executeCommand('editor.action.clipboardCutAction');
		await vscode.commands.executeCommand('flying-fish.disableSticky');
	});

	ExtFactory.registerCommand('clipboardPasteAction', async () => {
		await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
		await vscode.commands.executeCommand('flying-fish.disableSticky');
	});

	ExtFactory.registerCommand('pickAndPaste', async () => {
		await vscode.commands.executeCommand('clipboard-manager.editor.pickAndPaste');
		await vscode.commands.executeCommand('flying-fish.disableSticky');
	});

}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Congratulations, your extension "flying-fish" is now deactive!');
}
