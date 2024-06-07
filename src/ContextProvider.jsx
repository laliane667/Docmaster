import { useState, useEffect, useMemo } from "react"
import { readCookie, createCookie } from "./tools/Cookie"
import PropTypes from "prop-types"

import { userContext, setUserContext } from "./Context"

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
export default function ContextProvider({ children }) {
  const defaultUser = {
    role: readCookie("role"),
    id: readCookie("id"),
    token: readCookie("token"),
    email: readCookie("email"),
    fullName: readCookie("fullName"),
    photo: readCookie("photo"),
  }

  return <CreateContext defaultUser={defaultUser}>{children}</CreateContext>
}

CreateContext.propTypes = {
  children: PropTypes.node.isRequired,
  defaultUser: PropTypes.object.isRequired,
}
function CreateContext({ children, defaultUser }) {
  const [user, setUser] = useState(defaultUser)

  useEffect(() => {
    createCookie("role", user.role, 356)
    createCookie("id", user.id, 365)
    createCookie("token", user.token, 365)
    createCookie("email", user.email, 365)
    createCookie("fullName", user.fullName, 365)
    createCookie("photo", user.photo, 365)
  }, [user])

  return (
    <userContext.Provider value={useMemo(() => user, [user])}>
      <setUserContext.Provider value={useMemo(() => setUser, [setUser])}>{children}</setUserContext.Provider>
    </userContext.Provider>
  )
}
