import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

export default makeStyles(
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
  (theme: Theme) => ({
    root: {
      // style code
    },
  }),
  { name: 'UserPopMenu' },
)

export const useListItemClasses = makeStyles(
  (theme: Theme) => ({
    secondaryAction: { paddingRight: theme.spacing(10) },
  }),
  { name: 'UserPopMenu-ListItem', index: 1 },
)
