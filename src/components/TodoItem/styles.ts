import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'
import color from 'color'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      transition: theme.transitions.create([
        'box-shadow',
        'border-radius',
        'background-color',
      ]),
    },
    dragIcon: {
      width: 42,
      minWidth: 42,
      display: 'flex',
      justifyContent: 'center',
      marginLeft: 14,
    },
    dragging: {
      backgroundColor: color(theme.palette.background.paper)
        .lighten(0.2)
        .toString(),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[15],
    },
    deleting: {

    },
  }),
  { name: 'TodoItem', index: 1 },
)
