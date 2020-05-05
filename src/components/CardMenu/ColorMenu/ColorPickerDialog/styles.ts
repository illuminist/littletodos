import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      // style code
    },
    content: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    colorButton: {
      width: 56,
      height: 56,
    },
    selected: {
      backgroundColor: theme.palette.action.selected,
    },
    colorButtonContent: {
      width: 32,
      height: 32,
      borderRadius: '50%',
    },
  }),
  { name: 'ColorPickerDialog', index: 1 },
)
