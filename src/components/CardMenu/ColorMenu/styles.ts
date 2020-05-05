import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      // style code
    },
    colorIcon: {
      width: 40,
      height: 40,
      borderRadius: '50%',
    },
  }),
  { name: 'ColorMemu', index: 1 },
)
