/* ─── FONT DATA ─── */

export interface CodeFont {
  id: string
  name: string
  family: string
  /** Google Fonts URL or CDN URL */
  url: string
  weights: number[]
  hasLigatures: boolean
}

export const fonts: CodeFont[] = [
  {
    id: 'fira-code',
    name: 'Fira Code',
    family: "'Fira Code', monospace",
    url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;700&display=swap',
    weights: [300, 400, 500, 700],
    hasLigatures: true,
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    family: "'JetBrains Mono', monospace",
    url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap',
    weights: [300, 400, 500, 700],
    hasLigatures: true,
  },
  {
    id: 'cascadia-code',
    name: 'Cascadia Code',
    family: "'Cascadia Code', monospace",
    url: 'https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code@latest/index.css',
    weights: [300, 400, 600, 700],
    hasLigatures: true,
  },
  {
    id: 'source-code-pro',
    name: 'Source Code Pro',
    family: "'Source Code Pro', monospace",
    url: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap',
    weights: [300, 400, 500, 700],
    hasLigatures: false,
  },
  {
    id: 'ibm-plex-mono',
    name: 'IBM Plex Mono',
    family: "'IBM Plex Mono', monospace",
    url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap',
    weights: [300, 400, 500, 700],
    hasLigatures: false,
  },
  {
    id: 'inconsolata',
    name: 'Inconsolata',
    family: "'Inconsolata', monospace",
    url: 'https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;500;700&display=swap',
    weights: [300, 400, 500, 700],
    hasLigatures: false,
  },
  {
    id: 'space-mono',
    name: 'Space Mono',
    family: "'Space Mono', monospace",
    url: 'https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap',
    weights: [400, 700],
    hasLigatures: false,
  },
  {
    id: 'dm-mono',
    name: 'DM Mono',
    family: "'DM Mono', monospace",
    url: 'https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap',
    weights: [300, 400, 500],
    hasLigatures: false,
  },
  {
    id: 'hack',
    name: 'Hack',
    family: "'Hack', monospace",
    url: 'https://cdn.jsdelivr.net/npm/hack-font@3/build/web/hack.css',
    weights: [400, 700],
    hasLigatures: false,
  },
  {
    id: 'anonymous-pro',
    name: 'Anonymous Pro',
    family: "'Anonymous Pro', monospace",
    url: 'https://fonts.googleapis.com/css2?family=Anonymous+Pro:ital,wght@0,400;0,700;1,400&display=swap',
    weights: [400, 700],
    hasLigatures: false,
  },
  {
    id: 'victor-mono',
    name: 'Victor Mono',
    family: "'Victor Mono', monospace",
    url: 'https://fonts.googleapis.com/css2?family=Victor+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap',
    weights: [300, 400, 500, 700],
    hasLigatures: true,
  },
  {
    id: 'courier-prime',
    name: 'Courier Prime',
    family: "'Courier Prime', monospace",
    url: 'https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap',
    weights: [400, 700],
    hasLigatures: false,
  },
]

/** Load a font dynamically by injecting a <link> tag and waiting for it to be ready */
export function loadFont(font: CodeFont): Promise<void> {
  return new Promise((resolve) => {
    // Check if already loaded in HTML or previously injected
    const existingLink = document.querySelector(`link[data-font-id="${font.id}"]`)
    if (existingLink) {
      resolve()
      return
    }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = font.url
    link.crossOrigin = 'anonymous'
    link.dataset.fontId = font.id
    link.onload = () => resolve()
    link.onerror = () => resolve()
    document.head.appendChild(link)
  })
}

/**
 * Preload ALL font binaries at page load.
 * The CSS stylesheets are already in index.html, but browsers download
 * font files lazily. This forces every font to download immediately
 * so switching is instant with zero delay.
 */
export async function preloadAllFonts(): Promise<void> {
  const loadPromises = fonts.map(font => {
    // Extract just the font name (without fallback) for document.fonts.load
    const nameMatch = font.family.match(/'([^']+)'/)
    const fontName = nameMatch ? nameMatch[1] : font.family
    return document.fonts.load(`400 16px "${fontName}"`).catch(() => {})
  })
  await Promise.allSettled(loadPromises)
}

/** Get font by ID */
export function getFontById(id: string): CodeFont | undefined {
  return fonts.find(f => f.id === id)
}

