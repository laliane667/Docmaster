import { createContext, useContext } from "react"

export const userContext = createContext(undefined)
export const useUser = () => useContext(userContext)
export const setUserContext = createContext(undefined)
export const useSetUser = () => useContext(setUserContext)
