import * as React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  MuiThemeProvider,
  createMuiTheme,
  ThemeProviderProps,
  Theme,
} from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import produce from 'immer'

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  children,
}) => {
  const nightmode = useSelector((state) => state.settings.nightMode)
  const fullTheme = React.useMemo(() => {
    const r =
      typeof theme === 'function' ? (theme(createMuiTheme()) as Theme) : theme
    const s = produce(r, (theme: Theme) => {
      theme.palette.type = nightmode ? 'dark' : 'light'
      if (nightmode) {
        delete theme.palette.background.default
      }
    })
    const t = createMuiTheme(s)
    return t
  }, [theme, nightmode])
  return (
    <MuiThemeProvider theme={fullTheme}>
      <CssBaseline>{children}</CssBaseline>
    </MuiThemeProvider>
  )
}
