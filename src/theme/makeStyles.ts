import omit from 'lodash/omit'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { makeStyles as oriMakeStyles } from '@material-ui/styles'

import { Styles, WithStylesOptions } from '@material-ui/styles/withStyles'

export const makeStyles = <
  Props extends {} = {},
  ClassKey extends string = string
>(
  styles: Styles<Theme, Props, ClassKey>,
  options?: WithStylesOptions<Theme>,
) => {
  return oriMakeStyles(
    styles,
    process.env.NODE_ENV === 'production' ? omit(options, 'name') : options,
  )
}
export default makeStyles
