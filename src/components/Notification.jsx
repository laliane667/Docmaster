import { notifications } from "@mantine/notifications"
import { rem } from "@mantine/core"
import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react"

export function NotifSuccess(title, message = "", autoClose = 5000) {
  notifications.clean()
  notifications.show({
    title: title,
    message: message,
    autoClose: autoClose,
    color: "teal",
    position: "top-right",
    icon: <IconCheck style={{ height: rem(18), width: rem(18), strokeWidth: rem(1.5), color: "black" }} />,
  })
}

export function NotifError(title, message = "", autoClose = 7000) {
  notifications.show({
    title: title,
    message: message,
    autoClose: autoClose,
    color: "red",
    position: "top-right",
    icon: <IconX style={{ height: rem(18), width: rem(18), strokeWidth: rem(1.5), color: "black" }} />,
  })
}

export function NotifWarning(title, message = "", autoClose = 6000) {
  notifications.show({
    title: title,
    message: message,
    autoClose: autoClose,
    color: "yellow",
    position: "top-right",
    icon: <IconAlertTriangle style={{ height: rem(18), width: rem(18), strokeWidth: rem(1.5), color: "black" }} />,
  })
}

export function NotifInfo(title, message = "", autoClose = 2000) {
  notifications.show({
    title: title,
    message: message,
    autoClose: autoClose,
    color: "blue",
    position: "top-right",
    icon: <IconInfoCircle style={{ height: rem(18), width: rem(18), strokeWidth: rem(1.5), color: "black" }} />,
  })
}
