import _ from 'lodash'
import classNames from 'clsx'
import React from 'react'
import useStyles, { useListItemClasses } from './styles'
import Hidden from '@material-ui/core/Hidden'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import HistoryIcon from '@material-ui/icons/History'
import SettingsIcon from '@material-ui/icons/Settings'
import LanguageIcon from '@material-ui/icons/Language'
import InfoIcon from '@material-ui/icons/Info'
import PowerOffRoundedIcon from '@material-ui/icons/PowerOffRounded'
import PowerIcon from '@material-ui/icons/Power'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
// import { setNightMode } from 'actions/Settings'
// import { selectAppSettings } from 'selectors'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Switch from '@material-ui/core/Switch'
import { useHistory } from 'react-router-dom'
import Link from 'next/link'
import Router from 'next/router'
import { PopoverProps } from '@material-ui/core/Popover'
// import { Trans } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import firebase from 'firebase/app'
import { useFirebaseUser } from 'firebase-app/auth'
import usePopoverState from 'hooks/usePopoverState'
import settings from 'store/settings'
import { sleep } from 'utils/helpers'
import ExternalLink from 'components/ExternalLink'
import GithubLogo from 'components/icons/GithubLogo'

export type UserPopMenuProps = {
  classes?: object
  className?: string
  open: boolean
  onClose: () => void
  anchorEl: any
} & Pick<PopoverProps, 'anchorOrigin' | 'transformOrigin'>

export const UserPopMenu: React.FC<UserPopMenuProps> = (
  props: UserPopMenuProps,
) => {
  const classes = useStyles(props)
  const listItemClasses = useListItemClasses(props)
  const { className, open, anchorEl, onClose, ...restProps } = props
  const dispatch = useDispatch()
  const user = useFirebaseUser()

  const nightMode = useSelector((state) => state.settings.nightMode)
  const toggleNightMode = () => {
    dispatch(settings.actions.set('nightMode', !nightMode))
  }

  const history = useHistory()

  const { handleOpen: handleOpenLanguageDialog } = usePopoverState(
    'changeInterfaceLanguage',
  )

  const handleLogout = React.useCallback(async () => {
    await firebase.auth().signOut()
    history.replace('/')
  }, [history, firebase, onClose])

  const handleLink = React.useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.dataset.href
      if (!href) return
      e.preventDefault()
      history.goBack()
      await sleep(20)
      Router.push(href)
    },
    [],
  )

  const { handleOpen: handleOpenChatPre } = usePopoverState('chat')
  const handleOpenChat = React.useCallback(() => {
    onClose()
    setTimeout(handleOpenChatPre, 100)
  }, [handleOpenChatPre, onClose])

  return (
    <Menu
      {...restProps}
      className={classNames(className, classes.root)}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}>
      <ListItem classes={listItemClasses}>
        <ListItemIcon>
          <Brightness4Icon />
        </ListItemIcon>
        <ListItemText>Nightmode</ListItemText>
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            onChange={toggleNightMode}
            checked={nightMode}
            inputProps={{ 'aria-labelledby': 'switch-night-mode' }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <MenuItem
        component="a"
        href="/settings"
        onClick={handleLink}
        disabled={!user}
        data-href="/settings">
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <MenuItem
        component="a"
        href="/privacy-policy"
        onClick={handleLink}
        data-href="/privacy-policy">
        <ListItemText inset>Privacy Policy</ListItemText>
      </MenuItem>
      <MenuItem
        component="a"
        href="/terms-and-conditions"
        onClick={handleLink}
        data-href="/terms-and-conditions">
        <ListItemText inset>Terms and Conditions</ListItemText>
      </MenuItem>
      <MenuItem
        component={ExternalLink}
        href="https://github.com/illuminist/littletodos">
        <ListItemIcon>
          <GithubLogo />
        </ListItemIcon>
        <ListItemText>Github Repository</ListItemText>
      </MenuItem>
      {!user || user.isAnonymous ? null : (
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <PowerOffRoundedIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      )}
    </Menu>
  )
}

UserPopMenu.defaultProps = {}

export default UserPopMenu
