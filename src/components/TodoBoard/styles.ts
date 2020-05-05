import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    container: {},
    root: {
      paddingBottom: theme.spacing(8),
      minHeight: 'calc(100vh - 56px  - 64px - 24px)',
    },
    card: {
      marginBottom: theme.spacing(3),
    },
    addFab: {
      position: 'sticky',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      float: 'right',
    },
  }),
  { name: 'TodoBoard', index: 1 },
)
