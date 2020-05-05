import createMuiTheme, {
  ThemeOptions,
  Theme,
} from '@material-ui/core/styles/createMuiTheme'
import { Mixins, MixinsOptions } from '@material-ui/core/styles/createMixins'
import { CSSProperties } from '@material-ui/styles/withStyles'
import * as CSS from 'csstype'
import { Overrides } from '@material-ui/core/styles/overrides'

import { amber, teal, pink, grey } from '@material-ui/core/colors'

const flexDirectionCenter = {
  row: { justifyContent: 'center' },
  column: { alignItems: 'center' },
}

export const sansFonts =
  'Kanit, Sarabun, Prompt, "Roboto", "Helvetica", "Arial", sans-serif'
export const serifFonts =
  'Sarabun, Prompt, "Roboto", "Helvetica", "Arial", sans-serif'

export const noiseImage = '' //createNoiseImage({ color: grey[500] })

export const overrides = (theme: Theme): Overrides => ({
  MuiListItem: {
    root: {
      borderLeftStyle: 'solid',
      borderLeftColor: theme.palette.primary.main,
      borderLeftWidth: 0,
    },
  },
  MuiFormControl: {
    root: {
      '&.border': {
        borderColor: 'rgba(0,0,0,0.3)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: theme.shape.borderRadius,
      },
    },
  },
  MuiListItemText: {
    root: {
      '&.compact': {
        display: 'none',
      },
    },
  },
  MuiExpansionPanelSummary: {
    root: {
      fontFamily: sansFonts,
    },
  },
  MuiFormLabel: {
    root: {
      fontFamily: sansFonts,
    },
  },
  MuiCssBaseline: {
    '@global': {
      body: {
        backgroundColor: theme.palette.background.default,
        backgroundImage: `url("${noiseImage}")`,
        backgroundBlendMode: 'soft-light',
      },
      '@font-face': {
        fontFamily: 'prompt',
        unicodeRange: 'U+0E00-0E7F ',
      },
    },
  },
})

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    drawer: CSSProperties
    main: CSSProperties
    sidebar: CSSProperties
  }
  interface ThemeOptions extends Partial<Theme> {}
}

declare module '@material-ui/core/styles/createMixins' {
  interface Mixins {
    flex: (
      direction: CSS.FlexDirectionProperty,
      ...option: string[]
    ) => CSSProperties
    imageAvatar: () => CSSProperties
    mixBackgroundColor: (theme: Theme, color: string) => CSSProperties
  }
  interface MixinsOptions extends Partial<Mixins> {}
}

declare module '@material-ui/core/styles/createMixins' {
  interface Mixins {
    flex: (
      direction: CSS.FlexDirectionProperty,
      ...option: string[]
    ) => CSSProperties
    imageAvatar: () => CSSProperties
    mixBackgroundColor: (theme: Theme, color: string) => CSSProperties
  }
  interface MixinsOptions extends Partial<Mixins> {}
}

declare module '@material-ui/core/styles/createTypography' {
  interface Typography {
    sansFonts: string
    serifFonts: string
  }
  interface TypographyOptions extends Partial<Mixins> {}
}

export const theme = {
  palette: {
    background: {
      default: grey[300],
    },
    type: 'dark',
    primary: teal,
    secondary: pink,
  },
  mixins: {
    flex: (direction: 'column' | 'row' = 'column', ...options) => ({
      display: 'flex',
      flexDirection: direction,
      ...(options.includes('center') ? flexDirectionCenter[direction] : {}),
      ...(options.includes('wrap') ? { flexWrap: 'wrap' } : {}),
    }),
    imageAvatar: () => ({
      borderRadius: '12%',
    }),
    mixBackgroundColor: (theme, color) => ({
      backgroundColor: color,
      color: theme.palette.getContrastText(color),
    }),
  } as MixinsOptions,
  drawer: {
    width: 240,
  },
  main: {
    width: 720,
  },
  sidebar: {
    width: 300,
    flex: '0 0 300px',
  },
  typography: {
    fontSize: 14,
    fontFamily: serifFonts,
    sansFonts,
    serifFonts,
    // Tell Material-UI what the font-size on the html element is.
    // htmlFontSize: 10,
    h1: {
      fontFamily: sansFonts,
    },
    h2: {
      fontFamily: sansFonts,
    },
    h3: {
      fontFamily: sansFonts,
    },
    h4: {
      fontFamily: sansFonts,
    },
    h5: {
      fontFamily: sansFonts,
    },
    h6: {
      fontFamily: sansFonts,
    },
    // id: {
    //   fontFamily: 'monospace',
    //   fontSize: '0.7rem',
    //   color: 'rgba(0,0,0,0.2)',
    // },
  },
  shape: {
    borderRadius: 8,
  },
} as ThemeOptions

export default createMuiTheme(theme)
