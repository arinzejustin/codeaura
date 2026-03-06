/* ─── LANGUAGE DATA ─── */

export interface LanguageOption {
  id: string
  name: string
  /** CodeMirror language extension loader (lazy) */
  cmLoader?: () => Promise<any>
}

/**
 * Core languages with CodeMirror support.
 * Additional languages are listed for auto-detection and display only.
 */
export const languages: LanguageOption[] = [
  { id: 'javascript', name: 'JavaScript', cmLoader: () => import('@codemirror/lang-javascript').then(m => m.javascript({ jsx: true })) },
  { id: 'typescript', name: 'TypeScript', cmLoader: () => import('@codemirror/lang-javascript').then(m => m.javascript({ jsx: true, typescript: true })) },
  { id: 'python', name: 'Python', cmLoader: () => import('@codemirror/lang-python').then(m => m.python()) },
  { id: 'rust', name: 'Rust', cmLoader: () => import('@codemirror/lang-rust').then(m => m.rust()) },
  { id: 'java', name: 'Java', cmLoader: () => import('@codemirror/lang-java').then(m => m.java()) },
  { id: 'cpp', name: 'C++', cmLoader: () => import('@codemirror/lang-cpp').then(m => m.cpp()) },
  { id: 'c', name: 'C', cmLoader: () => import('@codemirror/lang-cpp').then(m => m.cpp()) },
  { id: 'html', name: 'HTML', cmLoader: () => import('@codemirror/lang-html').then(m => m.html()) },
  { id: 'css', name: 'CSS', cmLoader: () => import('@codemirror/lang-css').then(m => m.css()) },
  { id: 'json', name: 'JSON', cmLoader: () => import('@codemirror/lang-json').then(m => m.json()) },
  { id: 'markdown', name: 'Markdown', cmLoader: () => import('@codemirror/lang-markdown').then(m => m.markdown()) },
  { id: 'sql', name: 'SQL', cmLoader: () => import('@codemirror/lang-sql').then(m => m.sql()) },
  { id: 'xml', name: 'XML', cmLoader: () => import('@codemirror/lang-xml').then(m => m.xml()) },
  { id: 'php', name: 'PHP', cmLoader: () => import('@codemirror/lang-php').then(m => m.php()) },
  
  // Display-only languages (CodeMirror will use plain text mode)
  { id: 'go', name: 'Go' },
  { id: 'swift', name: 'Swift' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'csharp', name: 'C#' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'dart', name: 'Dart' },
  { id: 'elixir', name: 'Elixir' },
  { id: 'haskell', name: 'Haskell' },
  { id: 'lua', name: 'Lua' },
  { id: 'perl', name: 'Perl' },
  { id: 'r', name: 'R' },
  { id: 'scala', name: 'Scala' },
  { id: 'shell', name: 'Shell/Bash' },
  { id: 'powershell', name: 'PowerShell' },
  { id: 'yaml', name: 'YAML' },
  { id: 'toml', name: 'TOML' },
  { id: 'graphql', name: 'GraphQL' },
  { id: 'scss', name: 'SCSS' },
  { id: 'less', name: 'LESS' },
  { id: 'dockerfile', name: 'Dockerfile' },
  { id: 'terraform', name: 'Terraform' },
  { id: 'jsx', name: 'JSX' },
  { id: 'tsx', name: 'TSX' },
  { id: 'vue', name: 'Vue SFC' },
  { id: 'svelte', name: 'Svelte' },
  { id: 'solidity', name: 'Solidity' },
  { id: 'zig', name: 'Zig' },
  { id: 'nim', name: 'Nim' },
  { id: 'clojure', name: 'Clojure' },
  { id: 'fsharp', name: 'F#' },
  { id: 'ocaml', name: 'OCaml' },
  { id: 'erlang', name: 'Erlang' },
  { id: 'latex', name: 'LaTeX' },
  { id: 'makefile', name: 'Makefile' },
  { id: 'nginx', name: 'Nginx' },
  { id: 'diff', name: 'Diff' },
  { id: 'ini', name: 'INI' },
  { id: 'regex', name: 'Regex' },
  { id: 'assembly', name: 'Assembly (x86)' },
  { id: 'glsl', name: 'GLSL/WGSL' },
  { id: 'nix', name: 'Nix' },
  { id: 'gleam', name: 'Gleam' },
]

/** Get language by ID */
export function getLanguageById(id: string): LanguageOption | undefined {
  return languages.find(l => l.id === id)
}
