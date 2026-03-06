/* ─── THEME DATA ─── 
 * Each theme defines syntax highlighting colors for the code card.
 * Categories: Dark, Light, High Contrast, Retro/Special
 */

export interface CodeTheme {
  id: string
  name: string
  category: 'dark' | 'light' | 'high-contrast' | 'retro'
  colors: {
    background: string
    foreground: string
    cursor: string
    selection: string
    comment: string
    keyword: string
    string: string
    number: string
    function: string
    variable: string
    type: string
    operator: string
    punctuation: string
    tag: string
    attribute: string
    property: string
  }
}

export const themes: CodeTheme[] = [
  // ── DARK THEMES ──
  {
    id: 'dracula',
    name: 'Dracula',
    category: 'dark',
    colors: {
      background: '#282a36',
      foreground: '#f8f8f2',
      cursor: '#f8f8f2',
      selection: '#44475a',
      comment: '#6272a4',
      keyword: '#ff79c6',
      string: '#f1fa8c',
      number: '#bd93f9',
      function: '#50fa7b',
      variable: '#f8f8f2',
      type: '#8be9fd',
      operator: '#ff79c6',
      punctuation: '#f8f8f2',
      tag: '#ff79c6',
      attribute: '#50fa7b',
      property: '#66d9ef',
    }
  },
  {
    id: 'one-dark-pro',
    name: 'One Dark Pro',
    category: 'dark',
    colors: {
      background: '#282c34',
      foreground: '#abb2bf',
      cursor: '#528bff',
      selection: '#3e4451',
      comment: '#5c6370',
      keyword: '#c678dd',
      string: '#98c379',
      number: '#d19a66',
      function: '#61afef',
      variable: '#e06c75',
      type: '#e5c07b',
      operator: '#56b6c2',
      punctuation: '#abb2bf',
      tag: '#e06c75',
      attribute: '#d19a66',
      property: '#e06c75',
    }
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    category: 'dark',
    colors: {
      background: '#1a1b26',
      foreground: '#a9b1d6',
      cursor: '#c0caf5',
      selection: '#33467c',
      comment: '#565f89',
      keyword: '#9d7cd8',
      string: '#9ece6a',
      number: '#ff9e64',
      function: '#7aa2f7',
      variable: '#c0caf5',
      type: '#2ac3de',
      operator: '#89ddff',
      punctuation: '#a9b1d6',
      tag: '#f7768e',
      attribute: '#9ece6a',
      property: '#73daca',
    }
  },
  {
    id: 'tokyo-night-storm',
    name: 'Tokyo Night Storm',
    category: 'dark',
    colors: {
      background: '#24283b',
      foreground: '#a9b1d6',
      cursor: '#c0caf5',
      selection: '#2e3c64',
      comment: '#565f89',
      keyword: '#9d7cd8',
      string: '#9ece6a',
      number: '#ff9e64',
      function: '#7aa2f7',
      variable: '#c0caf5',
      type: '#2ac3de',
      operator: '#89ddff',
      punctuation: '#a9b1d6',
      tag: '#f7768e',
      attribute: '#9ece6a',
      property: '#73daca',
    }
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    category: 'dark',
    colors: {
      background: '#1e1e2e',
      foreground: '#cdd6f4',
      cursor: '#f5e0dc',
      selection: '#45475a',
      comment: '#6c7086',
      keyword: '#cba6f7',
      string: '#a6e3a1',
      number: '#fab387',
      function: '#89b4fa',
      variable: '#cdd6f4',
      type: '#94e2d5',
      operator: '#89dceb',
      punctuation: '#bac2de',
      tag: '#f38ba8',
      attribute: '#a6e3a1',
      property: '#f5c2e7',
    }
  },
  {
    id: 'nord',
    name: 'Nord',
    category: 'dark',
    colors: {
      background: '#2e3440',
      foreground: '#d8dee9',
      cursor: '#d8dee9',
      selection: '#434c5e',
      comment: '#616e88',
      keyword: '#81a1c1',
      string: '#a3be8c',
      number: '#b48ead',
      function: '#88c0d0',
      variable: '#d8dee9',
      type: '#8fbcbb',
      operator: '#81a1c1',
      punctuation: '#eceff4',
      tag: '#81a1c1',
      attribute: '#8fbcbb',
      property: '#88c0d0',
    }
  },
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox Dark',
    category: 'dark',
    colors: {
      background: '#282828',
      foreground: '#ebdbb2',
      cursor: '#ebdbb2',
      selection: '#3c3836',
      comment: '#928374',
      keyword: '#fb4934',
      string: '#b8bb26',
      number: '#d3869b',
      function: '#fabd2f',
      variable: '#ebdbb2',
      type: '#8ec07c',
      operator: '#fe8019',
      punctuation: '#ebdbb2',
      tag: '#fb4934',
      attribute: '#b8bb26',
      property: '#83a598',
    }
  },
  {
    id: 'rose-pine',
    name: 'Rosé Pine',
    category: 'dark',
    colors: {
      background: '#191724',
      foreground: '#e0def4',
      cursor: '#524f67',
      selection: '#2a283e',
      comment: '#6e6a86',
      keyword: '#31748f',
      string: '#f6c177',
      number: '#eb6f92',
      function: '#9ccfd8',
      variable: '#e0def4',
      type: '#c4a7e7',
      operator: '#31748f',
      punctuation: '#908caa',
      tag: '#eb6f92',
      attribute: '#f6c177',
      property: '#9ccfd8',
    }
  },
  {
    id: 'monokai-pro',
    name: 'Monokai Pro',
    category: 'dark',
    colors: {
      background: '#2d2a2e',
      foreground: '#fcfcfa',
      cursor: '#fcfcfa',
      selection: '#403e41',
      comment: '#727072',
      keyword: '#ff6188',
      string: '#ffd866',
      number: '#ab9df2',
      function: '#a9dc76',
      variable: '#fcfcfa',
      type: '#78dce8',
      operator: '#ff6188',
      punctuation: '#939293',
      tag: '#ff6188',
      attribute: '#ffd866',
      property: '#78dce8',
    }
  },
  {
    id: 'synthwave-84',
    name: "Synthwave '84",
    category: 'dark',
    colors: {
      background: '#262335',
      foreground: '#ffffff',
      cursor: '#ffffff',
      selection: '#463465',
      comment: '#848bbd',
      keyword: '#fede5d',
      string: '#ff8b39',
      number: '#f97e72',
      function: '#36f9f6',
      variable: '#ffffff',
      type: '#fe4450',
      operator: '#fede5d',
      punctuation: '#ffffff',
      tag: '#72f1b8',
      attribute: '#fede5d',
      property: '#36f9f6',
    }
  },
  {
    id: 'ayu-dark',
    name: 'Ayu Dark',
    category: 'dark',
    colors: {
      background: '#0a0e14',
      foreground: '#b3b1ad',
      cursor: '#e6b450',
      selection: '#273747',
      comment: '#626a73',
      keyword: '#ff8f40',
      string: '#c2d94c',
      number: '#e6b450',
      function: '#ffb454',
      variable: '#b3b1ad',
      type: '#59c2ff',
      operator: '#f29668',
      punctuation: '#b3b1ad',
      tag: '#39bae6',
      attribute: '#c2d94c',
      property: '#ffb454',
    }
  },
  {
    id: 'vesper',
    name: 'Vesper',
    category: 'dark',
    colors: {
      background: '#101010',
      foreground: '#b7b7b7',
      cursor: '#ffffff',
      selection: '#2a2a2a',
      comment: '#505050',
      keyword: '#de9a5b',
      string: '#6fb38a',
      number: '#de9a5b',
      function: '#d1a35c',
      variable: '#b7b7b7',
      type: '#8fb8de',
      operator: '#de9a5b',
      punctuation: '#777777',
      tag: '#de9a5b',
      attribute: '#6fb38a',
      property: '#d1a35c',
    }
  },

  // ── LIGHT THEMES ──
  {
    id: 'github-light',
    name: 'GitHub Light',
    category: 'light',
    colors: {
      background: '#ffffff',
      foreground: '#24292e',
      cursor: '#044289',
      selection: '#c8e1ff',
      comment: '#6a737d',
      keyword: '#d73a49',
      string: '#032f62',
      number: '#005cc5',
      function: '#6f42c1',
      variable: '#24292e',
      type: '#005cc5',
      operator: '#d73a49',
      punctuation: '#24292e',
      tag: '#22863a',
      attribute: '#6f42c1',
      property: '#005cc5',
    }
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    category: 'light',
    colors: {
      background: '#fdf6e3',
      foreground: '#657b83',
      cursor: '#657b83',
      selection: '#eee8d5',
      comment: '#93a1a1',
      keyword: '#859900',
      string: '#2aa198',
      number: '#d33682',
      function: '#268bd2',
      variable: '#657b83',
      type: '#b58900',
      operator: '#859900',
      punctuation: '#657b83',
      tag: '#268bd2',
      attribute: '#2aa198',
      property: '#b58900',
    }
  },
  {
    id: 'catppuccin-latte',
    name: 'Catppuccin Latte',
    category: 'light',
    colors: {
      background: '#eff1f5',
      foreground: '#4c4f69',
      cursor: '#dc8a78',
      selection: '#acb0be',
      comment: '#9ca0b0',
      keyword: '#8839ef',
      string: '#40a02b',
      number: '#fe640b',
      function: '#1e66f5',
      variable: '#4c4f69',
      type: '#179299',
      operator: '#04a5e5',
      punctuation: '#5c5f77',
      tag: '#d20f39',
      attribute: '#40a02b',
      property: '#ea76cb',
    }
  },
  {
    id: 'one-light',
    name: 'One Light',
    category: 'light',
    colors: {
      background: '#fafafa',
      foreground: '#383a42',
      cursor: '#526fff',
      selection: '#e5e6e7',
      comment: '#a0a1a7',
      keyword: '#a626a4',
      string: '#50a14f',
      number: '#986801',
      function: '#4078f2',
      variable: '#e45649',
      type: '#c18401',
      operator: '#0184bc',
      punctuation: '#383a42',
      tag: '#e45649',
      attribute: '#986801',
      property: '#e45649',
    }
  },

  // ── HIGH CONTRAST ──
  {
    id: 'github-dark-hc',
    name: 'GitHub Dark HC',
    category: 'high-contrast',
    colors: {
      background: '#0a0c10',
      foreground: '#f0f3f6',
      cursor: '#f0f3f6',
      selection: '#2a3040',
      comment: '#768390',
      keyword: '#ff9492',
      string: '#a5d6ff',
      number: '#6bc46d',
      function: '#dcbdfb',
      variable: '#f0f3f6',
      type: '#6bc46d',
      operator: '#ff9492',
      punctuation: '#f0f3f6',
      tag: '#ff9492',
      attribute: '#6bc46d',
      property: '#a5d6ff',
    }
  },
  {
    id: 'pitch-black',
    name: 'Pitch Black',
    category: 'high-contrast',
    colors: {
      background: '#000000',
      foreground: '#ffffff',
      cursor: '#ffffff',
      selection: '#1a1a1a',
      comment: '#666666',
      keyword: '#ff6b6b',
      string: '#69db7c',
      number: '#ffd43b',
      function: '#74c0fc',
      variable: '#ffffff',
      type: '#b197fc',
      operator: '#ff6b6b',
      punctuation: '#aaaaaa',
      tag: '#ff6b6b',
      attribute: '#69db7c',
      property: '#74c0fc',
    }
  },
  {
    id: 'cobalt2',
    name: 'Cobalt2',
    category: 'high-contrast',
    colors: {
      background: '#193549',
      foreground: '#e1efff',
      cursor: '#ffc600',
      selection: '#0050a4',
      comment: '#0088ff',
      keyword: '#ffc600',
      string: '#a5ff90',
      number: '#ff628c',
      function: '#ffc600',
      variable: '#e1efff',
      type: '#80ffbb',
      operator: '#ffc600',
      punctuation: '#e1efff',
      tag: '#ff9d00',
      attribute: '#a5ff90',
      property: '#80ffbb',
    }
  },

  // ── RETRO / SPECIAL ──
  {
    id: 'amber-terminal',
    name: 'Amber Terminal',
    category: 'retro',
    colors: {
      background: '#1a1200',
      foreground: '#ffb000',
      cursor: '#ffb000',
      selection: '#3d2e00',
      comment: '#806000',
      keyword: '#ffd000',
      string: '#ffb000',
      number: '#ff9500',
      function: '#ffd700',
      variable: '#ffb000',
      type: '#ffc800',
      operator: '#ffd000',
      punctuation: '#cc8c00',
      tag: '#ffd000',
      attribute: '#ffb000',
      property: '#ffd700',
    }
  },
  {
    id: 'green-phosphor',
    name: 'Green Phosphor',
    category: 'retro',
    colors: {
      background: '#001100',
      foreground: '#00ff00',
      cursor: '#00ff00',
      selection: '#003300',
      comment: '#006600',
      keyword: '#00ff00',
      string: '#00cc00',
      number: '#00ff66',
      function: '#33ff33',
      variable: '#00ff00',
      type: '#00ff99',
      operator: '#00ff00',
      punctuation: '#00aa00',
      tag: '#00ff00',
      attribute: '#00cc00',
      property: '#33ff33',
    }
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    category: 'retro',
    colors: {
      background: '#1a0a2e',
      foreground: '#e0b0ff',
      cursor: '#ff71ce',
      selection: '#2d1b53',
      comment: '#6b4d8e',
      keyword: '#ff71ce',
      string: '#01cdfe',
      number: '#ffcb1f',
      function: '#b967ff',
      variable: '#e0b0ff',
      type: '#05ffa1',
      operator: '#ff71ce',
      punctuation: '#c39bd3',
      tag: '#ff71ce',
      attribute: '#01cdfe',
      property: '#b967ff',
    }
  },
  {
    id: 'hacker',
    name: 'Hacker (Matrix)',
    category: 'retro',
    colors: {
      background: '#000000',
      foreground: '#00ff41',
      cursor: '#00ff41',
      selection: '#0a2e0a',
      comment: '#005500',
      keyword: '#00ff41',
      string: '#00cc33',
      number: '#33ff66',
      function: '#00ff41',
      variable: '#00dd33',
      type: '#00ff88',
      operator: '#00ff41',
      punctuation: '#00aa22',
      tag: '#00ff41',
      attribute: '#00cc33',
      property: '#00ff41',
    }
  },
]

/** Get theme by ID */
export function getThemeById(id: string): CodeTheme | undefined {
  return themes.find(t => t.id === id)
}

/** Get themes grouped by category */
export function getThemesByCategory() {
  return {
    dark: themes.filter(t => t.category === 'dark'),
    light: themes.filter(t => t.category === 'light'),
    'high-contrast': themes.filter(t => t.category === 'high-contrast'),
    retro: themes.filter(t => t.category === 'retro'),
  }
}
