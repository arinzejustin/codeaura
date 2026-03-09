import * as vscode from 'vscode';
import { SnapshotWebviewPanel } from './WebviewProvider.js';

export function activate(context: vscode.ExtensionContext) {
  console.log('CodeAura extension is now active!');

  // Handle vscode://codeaura.codeaura-vscode/auth?token=...
  context.subscriptions.push(
    vscode.window.registerUriHandler({
      handleUri(uri: vscode.Uri) {
        if (uri.path === '/auth') {
          const queryParams = new URLSearchParams(uri.query);
          const token = queryParams.get('token');
          if (token && SnapshotWebviewPanel.currentPanel) {
            SnapshotWebviewPanel.currentPanel.sendAuthToken(token);
            vscode.window.showInformationMessage('Successfully signed in to CodeAura!');
          }
        }
      }
    })
  );

  let disposable = vscode.commands.registerCommand('codeaura.createSnapshot', () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showInformationMessage('Open a file and select code to create a snapshot.');
      return;
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if (!text) {
      vscode.window.showInformationMessage('Please select some code first.');
      return;
    }

    const language = editor.document.languageId;
    
    // Open the Webview Panel and pass the selected code and language
    SnapshotWebviewPanel.createOrShow(context.extensionUri, text, language);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
