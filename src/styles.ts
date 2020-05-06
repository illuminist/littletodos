import makeStyles from 'theme/makeStyles'

export const useLightBackgroundFilledInputStyles = makeStyles(
  () => ({
    root: {
      color: 'inherit',
      backgroundColor: 'rgba(255,255,255,0.18)',
    },
    underline: {
      '&:after': {
        borderBottomColor: 'rgba(255,255,255,0.50)',
      },
    },
  }),
  { name: 'SearchBox' },
)
