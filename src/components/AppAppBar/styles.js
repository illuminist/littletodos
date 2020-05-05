import makeStyles from 'theme/makeStyles'

export default makeStyles(
  (theme) => ({
    root: {
      width: '100%',
    },
    toolbar: {
      //   paddingLeft: theme.spacing(1),
      //   paddingRight: theme.spacing(1),
    },
    menuItem: {
      maxWidth: 300,
      marginRight: theme.spacing(2),
    },
    menuItemLast: {
      marginRight: 0,
    },
    appBar: {
      marginBottom: theme.spacing(3),
      // boxShadow: 'none',
    },
    gutter: {},
  }),
  { name: 'AppAppBar' },
)

export const searchBoxStyles = makeStyles(
  () => ({
    input: {
      paddingTop: 12,
    },
  }),
  { name: 'SearchBox' },
)
