import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      // style code
    },
    hint: {
      position: 'absolute',
      right: '100%',
      top: '-62%',
      width: 200,
    },
    hintIcon: {
      transform: 'rotate(180deg)',
      fontSize: 48,
      float: 'right' 
    },
  }),
  { name: 'AddButton', index: 1 },
)
