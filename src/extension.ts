// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FFContext from "./util/context";

let statusBarItem: vscode.StatusBarItem;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "flying-fish" is now active!');

	const factory = ExtensionFactory(context, 'flying-fish');
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	context.subscriptions.push(statusBarItem);

	factory.registerTextEditorCommand('insert-comma', (editor, edit) => {
		edit.insert(editor.selection.active, ",");
	});

	factory.registerCommand('start', () => {
		FFContext.set("flying-fish.mode", "leadering");
		if (vscode.window.activeTextEditor) {
			statusBarItem.text = "Flying";
			statusBarItem.show();
		} else {
			statusBarItem.hide();
		}
	});

	factory.registerCommand('stop', () => {
		FFContext.set("flying-fish.mode", "");
		if (statusBarItem) {
			statusBarItem.hide();
		}
	});

	factory.registerCommand('enable', () => {
		FFContext.set("flying-fish.enabled", true);
	});

	factory.registerCommand('disable', () => {
		FFContext.set("flying-fish.enabled", false);
	});

}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Congratulations, your extension "flying-fish" is now deactive!');
}

const ExtensionFactory = (context: vscode.ExtensionContext, prefix: string = "") => {

	const registerCommand = (command: string, callback: (...args: any[]) => any, thisArg?: any) => {
		context.subscriptions.push(vscode.commands.registerCommand(prefix + "." + command, callback, thisArg));
	};

	const registerTextEditorCommand = (command: string, callback: (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => void, thisArg?: any) => {
		context.subscriptions.push(vscode.commands.registerTextEditorCommand(prefix + "." + command, callback, thisArg));
	};

	return {
		registerCommand,
		registerTextEditorCommand
	};
};
