import _ from 'lodash'
import classNames from 'clsx'
import * as React from 'react'
import useStyles, { searchBoxStyles } from './styles'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Theme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import HomeIcon from '@material-ui/icons/Home'
import NoSsr from '@material-ui/core/NoSsr'
import UserDisplay from './UserDisplay'
import SearchBox from 'components/SearchBox'

import Hidden from '@material-ui/core/Hidden'
import { useRouteMatch, useHistory } from 'react-router'
import NextLink from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { useLightBackgroundFilledInputStyles } from 'styles'
import filter from 'store/filter'
import { useFirebaseUser } from 'firebase-app/auth'
import { useRouter } from 'next/router'

export interface Props {
  className?: string
  noSidebar?: boolean
}

export const AppAppBar: React.FC<Props> = (props) => {
  const classes = useStyles(props)
  const searchBoxClasses = searchBoxStyles(props)
  const textLightBGClasses = useLightBackgroundFilledInputStyles({})
  const combinedSearchBoxClasses = React.useMemo(() => {
    return { ...searchBoxClasses, ...textLightBGClasses }
  }, [searchBoxClasses, textLightBGClasses])
  const { className, children } = props

  const [elevated, setElevated] = React.useState(4)

  const user = useFirebaseUser()

  // const { handleOpen, open } = useSideBarState()

  React.useEffect(() => {
    const fn = () => {
      setElevated(window.scrollY > 10 ? 4 : 0)
    }
    setElevated(window.scrollY > 10 ? 4 : 0)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const matchXs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'))

  const router = useRouter()
  const matchHome = router.pathname === '/'

  const roomFilter = useSelector((state) => state.filter)
  const dispatch = useDispatch()

  const [searchOpen, setSearchOpen] = React.useState(false)
  const handleSearchOpen = React.useCallback(() => {
    setSearchOpen(true)
  }, [])
  const handleSearchClose = React.useCallback(() => {
    setSearchOpen(false)
  }, [])
  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(
        filter.actions.setFilter({
          field: 'textSearch',
          value: e.target.value,
        }),
      ),
    [],
  )
  const handleSearchClear = React.useCallback(
    () => dispatch(filter.actions.clearFilter()),
    [],
  )
  const isSearching = Boolean(searchOpen || roomFilter.textSearch)

  return (
    <div className={classNames(className, classes.root)}>
      <AppBar
        color="primary"
        className={classes.appBar}
        elevation={elevated}
        position="sticky">
        <Container maxWidth="md">
          <Toolbar className={classes.toolbar} disableGutters>
            <NextLink href="/" passHref>
              <IconButton component="a" color="inherit">
                <HomeIcon />
              </IconButton>
            </NextLink>
            {(!matchXs || !isSearching) && (
              <Typography variant="h5">Little Todos</Typography>
            )}
            <Box flexGrow={1} />
            {user && (
              <SearchBox
                className={classes.menuItem}
                variant="outlined"
                InputProps={{ classes: combinedSearchBoxClasses }}
                value={roomFilter.textSearch}
                fullWidth
                onOpen={handleSearchOpen}
                onBlur={handleSearchClose}
                placeholder="Search..."
                onChange={handleSearchChange}
                onClear={handleSearchClear}
              />
            )}

            <UserDisplay
              className={classNames(classes.menuItem, classes.menuItemLast)}
            />
          </Toolbar>
        </Container>
      </AppBar>
      {children}
    </div>
  )
}

export default AppAppBar

const obj = {
  propA: 'foo',
  propB: 'bar',
}
type TypeOfObj = typeof obj
type KeyOfObj = keyof TypeOfObj
