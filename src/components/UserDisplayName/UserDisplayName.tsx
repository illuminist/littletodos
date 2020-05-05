import _ from 'lodash'
import * as React from 'react'
// import useUserData from 'connectors/useUserData'
// import { useTranslation } from 'react-i18next'

export interface IUserDisplayNameProps {
  uid: string
}

export const UserDisplayName: React.FC<IUserDisplayNameProps> = (props) => {
  const { uid } = props
  const userdata = null
  // const { t } = useTranslation()

  if (!uid) {
    return <>Invalid User</>
  }

  if (userdata === undefined) {
    return <>loading</>
  }

  if (userdata === null) {
    return <>{uid.substring(0, 10)}</>
  }

  return null

  // if (userdata.isAnonymous) {
  //   return <>{{ uid: uid.substring(0, 5) }}</>
  // }

  // return <>{userdata.displayName || { uid: uid.substring(0, 5) }}</>
}

UserDisplayName.defaultProps = {}

export default UserDisplayName
