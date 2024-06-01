import { Avatar } from "@mantine/core"
import PropTypes from "prop-types"

UserAvatar.propTypes = {
  userId: PropTypes.string.isRequired,
  size: PropTypes.number,
  radius: PropTypes.string,
  otherProps: PropTypes.object,
}
export default function UserAvatar({ userId, size = 55, radius = "sm", ...otherProps }) {
  return (
    <Avatar
      src={globalThis.SERVER + "/uploads/" + userId + "/photo.png"}
      variant="filled"
      radius={radius}
      size={size}
      color="black"
      {...otherProps}
    />
  )
}
