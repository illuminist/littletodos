import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import Avatar from '@material-ui/core/Avatar'
import CircularProgress from '@material-ui/core/CircularProgress'
import useTheme from '@material-ui/core/styles/useTheme'
import { makeColor } from 'utils/helpers'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline'

export interface IUserAvatarProps {
  classes?: object
  className?: string
  uid?: string
}

export const UserAvatar = React.forwardRef<HTMLDivElement, IUserAvatarProps>(
  (props, ref) => {
    const classes = useStyles(props)
    const { className, uid } = props

    const theme = useTheme()

    const style = React.useMemo(() => {
      if (!uid)
        return {
          color: 'white',
        }
      const color = makeColor(uid)
      return {
        backgroundColor: color,
        color: theme.palette.getContrastText(color),
      }
    }, [uid, theme])

    return (
      <Avatar
        className={classNames(className, classes.root)}
        ref={ref}
        style={style}>
        {uid ? uid.substring(0, 2) : <PersonOutlineIcon />}
      </Avatar>
    )
  },
)

UserAvatar.defaultProps = {}

export default React.memo(UserAvatar)
