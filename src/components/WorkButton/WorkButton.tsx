import _ from 'lodash'
import classNames from 'clsx'
import React from 'react'
import useStyles from './styles'
import Button, { ButtonProps } from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

export interface Props extends ButtonProps {
  isWorking: boolean
}

export const WorkButton: React.FunctionComponent<Props> = props => {
  const classes = useStyles(props)
  const {
    className,
    children,
    isWorking,
    disabled,
    color,
    ...restProps
  } = props

  return (
    <Button
      className={className}
      disabled={disabled || isWorking}
      color={color}
      {...restProps}>
      {children}
      {isWorking && (
        <CircularProgress
          className={classes.progress}
          color={color === 'default' ? 'primary' : color}
          size={24}
        />
      )}
    </Button>
  )
}

export default WorkButton
