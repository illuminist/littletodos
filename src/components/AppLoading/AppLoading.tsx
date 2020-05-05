import _ from 'lodash'
import clsx from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

export interface AppLoadingProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

export const AppLoading: React.FC<AppLoadingProps> = (props) => {
  const classes = useStyles(props)
  const { className } = props

  return (
    <Box display="flex" justifyContent="center" marginTop={8}>
      <CircularProgress size={100} />
    </Box>
  )
}

AppLoading.defaultProps = {}

export default AppLoading
