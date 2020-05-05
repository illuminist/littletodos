import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'

const facebookColor = '#4267B2'
const twitterColor = '#00acee'
const googleColor = '#db4a39'

export default makeStyles(
  (theme: Theme) => ({
    root: {
      // style code
    },
    kradanLogoImage: {
      fontSize: 120,
    },
    kradanLogoTitle: {
      fontSize: 60,
      fontWeight: 'bold',
      userSelect: 'none',
    },
    kradanLogoSubTitle: {
      fontSize: 17,
      marginTop: -18,
      userSelect: 'none',
    },
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
    },
    innerDivider: {
      display: 'inline',
      flexGrow: 1,
    },
    dividerText: {
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
    authButton: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      color: '#fff',
    },
    socialAuthButton: {
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: '#fff',
        fill: 'unset',
        '&$facebookButton': {
          color: facebookColor,
        },
        '&$twitterButton': {
          color: twitterColor,
        },
        '&$googleButton': {
          color: googleColor,
        },
      },
      '&:not(:hover) $socialAuthButtonLogo': { fill: 'white' },
    },
    socialAuthButtonLogo: {
      marginRight: theme.spacing(1),
    },
    facebookButton: {
      backgroundColor: facebookColor,
    },
    twitterButton: {
      backgroundColor: twitterColor,
    },
    googleSegment: {},
    googleButton: {
      backgroundColor: googleColor,
      '&:hover': {},
      '&:not(:hover) $googleSegment': {
        fill: 'white',
      },
    },
    cardFooter: {
      textAlign: 'center',
    },
  }),
  { name: 'ChatLoginBox', index: 1 },
)
