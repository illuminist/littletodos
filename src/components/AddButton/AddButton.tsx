import _ from 'lodash'
import clsx from 'clsx'
import * as React from 'react'
import useStyles from './styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import ReplyIcon from '@material-ui/icons/Reply'
import { addCard } from 'firebase-actions/todos'
import useUserTodoOrder from 'connectors/useUserTodoOrder'
import { useFirebaseUser } from 'firebase-app/auth'

export interface AddButtonProps {
  classes?: Partial<ReturnType<typeof useStyles>>
  className?: string
  onAdd?: (id: string) => void
}

export const AddButton: React.FC<AddButtonProps> = (props) => {
  const classes = useStyles(props)
  const { className, onAdd } = props

  const user = useFirebaseUser()
  const userTodo = useUserTodoOrder(user?.uid).useData()

  const handleAdd = React.useCallback(async () => {
    const id = await addCard()
    onAdd && id && onAdd(id)
  }, [onAdd])

  if (userTodo === undefined) {
    return null
  }

  return (
    <div className={clsx(className, classes.root)}>
      <Fab color="secondary" onClick={handleAdd}>
        <AddIcon />
      </Fab>
      {!userTodo?.ordered.length && (
        <div className={classes.hint}>
          No checklist right now. You can add a new one by pressing this button
          <ReplyIcon className={classes.hintIcon} />
        </div>
      )}
    </div>
  )
}

AddButton.defaultProps = {}

export default AddButton
