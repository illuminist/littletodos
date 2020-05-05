import _ from 'lodash'
import classNames from 'clsx'
import React from 'react'
import useStyles from './styles'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import CircularProgress from '@material-ui/core/CircularProgress'
import PersonIcon from '@material-ui/icons/Person'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import usePopoverState from 'hooks/usePopoverState'
import UserPopMenu from '../UserPopMenu'
import UserAvatar from '../../UserAvatar'
import UserDisplayName from '../../UserDisplayName'
// import { useTranslation } from 'react-i18next'
import { useFirebaseUser } from 'firebase-app/auth'

export type UserDisplayProps = {
  classes?: object
  className?: string
}

export const UserDisplay: React.FC<UserDisplayProps> = (
  props: UserDisplayProps,
) => {
  const classes = useStyles(props)
  const { className } = props

  const user = useFirebaseUser()

  const anchorEl = React.useRef<HTMLDivElement>(null)
  const { open, handleOpen, handleClose } = usePopoverState('userMenu')

  // const { t } = useTranslation()

  const userDisplayProps = React.useMemo(
    () => ({
      // anchorOrigin: {
      //   vertical: 'bottom',
      //   horizontal: 'right',
      // },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    }),
    [],
  )

  if (user === undefined) {
    return (
      <ListItem
        className={classNames(className, classes.root)}
        component="div"
        dense>
        <ListItemAvatar>
          <CircularProgress />
        </ListItemAvatar>
      </ListItem>
    )
  }

  // if (user === null) {
  //   return (
  //     <ListItem
  //       className={classNames(className, classes.root)}
  //       component="div"
  //       dense
  //       onClick={handleOpen}
  //       button>
  //       {t('guest')}
  //     </ListItem>
  //   )
  // }

  return (
    <>
      <Hidden smDown>
        <ListItem
          className={classNames(className, classes.root)}
          component="div"
          onClick={handleOpen}
          button
          dense>
          <ListItemAvatar>
            {user ? (
              <UserAvatar uid={user.email || user.uid} />
            ) : (
              <PersonOutlineIcon />
            )}
          </ListItemAvatar>

          <ListItemText primary={user ? user.email : 'guest'} />

          <ArrowDropDownIcon />
        </ListItem>
      </Hidden>
      <Hidden mdUp>
        <IconButton onClick={handleOpen} color="inherit">
          {user ? <UserAvatar uid={user.email || user.uid} /> : <PersonOutlineIcon />}
        </IconButton>
      </Hidden>
      <div className={classes.anchorEl} ref={anchorEl} />
      <UserPopMenu
        {...(userDisplayProps as any)}
        onClose={handleClose}
        open={open}
        anchorEl={anchorEl.current}
      />
    </>
  )
}

UserDisplay.defaultProps = {}

export default UserDisplay
