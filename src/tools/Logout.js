import { eraseCookie } from "./Cookie"
import { NotifInfo } from "../components/Notification"

export default function Logout(setUser, navigate, redirect = "/") {
  eraseCookie("role")
  eraseCookie("id")
  eraseCookie("token")
  eraseCookie("email")
  eraseCookie("fullName")
  eraseCookie("photo")
  eraseCookie("score")
  eraseCookie("grade")
  NotifInfo("Vous avez bien été déconnecté.", "", 2500)
  setUser({ role: undefined, id: undefined, token: undefined, email: undefined, fullName: undefined, photo: undefined, score: undefined, grade: undefined })
  navigate(redirect)
}
