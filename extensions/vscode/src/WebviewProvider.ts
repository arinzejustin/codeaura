import * as vscode from 'vscode';
import * as fs from 'fs';

export class SnapshotWebviewPanel {
  public static currentPanel: SnapshotWebviewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri, code: string, language: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.ViewColumn.Beside
      : vscode.ViewColumn.One;

    if (SnapshotWebviewPanel.currentPanel) {
      SnapshotWebviewPanel.currentPanel._panel.reveal(column);
      SnapshotWebviewPanel.currentPanel.sendUpdate(code, language);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'codeauraSnapshot',
      'CodeAura Snapshot',
      column,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist-web')]
      }
    );

    SnapshotWebviewPanel.currentPanel = new SnapshotWebviewPanel(panel, extensionUri);
    SnapshotWebviewPanel.currentPanel.sendUpdate(code, language);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;

    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview, extensionUri);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      (message: any) => {
        switch (message.command) {
          case 'saveHistory':
            vscode.window.showInformationMessage('Snapshot saved locally (TODO)');
            return;
          case 'login':
            const loginUrl = vscode.Uri.parse('https://codeaura.fun/auth/vscode-login');
            vscode.env.openExternal(loginUrl);
            return;
        }
      },
      null,
      this._disposables
    );
  }

  public sendUpdate(code: string, language: string) {
    this._panel.webview.postMessage({ command: 'updateCode', code, language });
  }

  public sendAuthToken(token: string) {
    this._panel.webview.postMessage({ command: 'syncAuth', token });
  }

  public dispose() {
    SnapshotWebviewPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const indexPath = vscode.Uri.joinPath(extensionUri, 'dist-web', 'index.html');
    try {
      let html = fs.readFileSync(indexPath.fsPath, 'utf8');
      
      const nonce = getNonce();
      const scriptInjection = `<script nonce="${nonce}">window.vscode = acquireVsCodeApi();</script>`;
      html = html.replace('</head>', `${scriptInjection}</head>`);
      
      return html;
    } catch (e) {
      console.error(e);
      return `<!DOCTYPE html><html><body><h1>Error loading Webview UI</h1><pre>${String(e)}</pre></body></html>`;
    }
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
