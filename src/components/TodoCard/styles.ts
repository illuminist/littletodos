import makeStyles from 'theme/makeStyles'
import { Theme } from '@material-ui/core/styles'
import { TodoList } from 'types/data'

export const useErrorCardStyles = makeStyles(
  (theme) => ({
    root: {
      backgroundColor: theme.palette.error.main,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    icon: {
      fontSize: 80,
    },
    text: {
      fontSize: 40,
    },
  }),
  { index: 1 },
)

export default makeStyles(
  (theme: Theme) => ({
    root: {
      color: ({ data }: { data: TodoList | null }) =>
        data?.colorPrimary &&
        theme.palette.getContrastText(
          theme.palette.primary[
            theme.palette.type === 'dark' ? 'dark' : 'main'
          ],
        ),
      backgroundColor: ({ data }: { data: TodoList | null }) =>
        data?.colorPrimary &&
        theme.palette.primary[theme.palette.type === 'dark' ? 'dark' : 'main'],
      paddingBottom: 6,
      transition: theme.transitions.create(['background-color', 'box-shadow']),
    },
    loadingCard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(8),
    },
    cardContent: {
      backgroundColor: ({ data }: { data: TodoList | null }) =>
        data?.colorPrimary ? theme.palette.background.paper : undefined,
      color: theme.palette.text.primary,
      borderRadius: theme.shape.borderRadius,
    },
    head: {
      display: 'flex',
      padding: theme.spacing(2),
    },
    littleFoot: {
      height: 4,
    },
    headTitle: {
      flexGrow: 1,
    },
    headDragIcon: {
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    untitledTitle: {
      opacity: 0.6,
      fontStyle: 'italic',
    },
    addIcon: {
      paddingLeft: 9,
    },
    titleEditorRoot: {
      transform: 'translateY(2px)',
    },
    titleEditorInput: {
      fontSize: theme.typography.h5.fontSize,
      color: ({ data }) =>
        data?.colorPrimary &&
        theme.palette.getContrastText(
          theme.palette.primary[
            theme.palette.type === 'dark' ? 'dark' : 'main'
          ],
        ),
    },
    titleEditorUnderline: {
      '&:after': {
        borderBottomColor: ({ data }) =>
          data?.colorPrimary &&
          theme.palette.getContrastText(
            theme.palette.primary[
              theme.palette.type === 'dark' ? 'dark' : 'main'
            ],
          ),
      },
    },
    deleteZone: {
      position: 'absolute',
      width: '100%',
      top: theme.spacing(1),
      backgroundColor: theme.palette.error.dark,
      boxShadow: 'inset 0px 4px 9px 0px rgba(0,0,0,0.75)',
    },
  }),
  { name: 'TodoCard', index: 1 },
)
