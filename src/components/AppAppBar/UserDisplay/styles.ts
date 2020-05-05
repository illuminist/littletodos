import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
  (theme: Theme) => ({
    root: {
      [theme.breakpoints.down('sm')]: {
        width: 'auto',
      },
    },
    anchorEl: {
      height: '100%',
      alignSelf: 'flex-end',
    }
  }),
  { name: 'UserDisplay', index: 1 },
)
