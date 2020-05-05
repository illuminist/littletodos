import _ from 'lodash'
import clsx from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import AppAppBar from 'components/AppAppBar'

export interface AppLayoutProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
}

export const AppLayout: React.FC<AppLayoutProps> = (props) => {
  const classes = useStyles(props)
  const { className, children } = props

  return (
    <div className={clsx(className, classes.root)}>
      <AppAppBar>{children}</AppAppBar>
    </div>
  )
}

AppLayout.defaultProps = {}

export default AppLayout
