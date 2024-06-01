import { useState } from "react"
import { IconCheck, IconX, IconLock } from "@tabler/icons-react"
import { PasswordInput, Progress, Text, Popover, rem, Box } from "@mantine/core"
import PropTypes from "prop-types"

PasswordRequirement.propTypes = {
  meets: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
}
function PasswordRequirement({ meets, label }) {
  return (
    <Text c={meets ? "teal" : "red"} style={{ display: "flex", alignItems: "center" }} mt={7} size="sm">
      {meets ? (
        <IconCheck style={{ width: rem(14), height: rem(14) }} />
      ) : (
        <IconX style={{ width: rem(14), height: rem(14) }} />
      )}{" "}
      <Box ml={10}>{label}</Box>
    </Text>
  )
}

const requirements = [
  { re: /[0-9]/, label: "Inclure un nombre" },
  { re: /[a-z]/, label: "Inclure une lettre minuscule" },
  { re: /[A-Z]/, label: "Inclure une lettre majuscule" },
  { re: /[$&+,:=?@#|'<>.^*()%!-/]/, label: "Inclure un caractère spécial" },
]

function getStrength(password) {
  let multiplier = password.length >= 8 ? 0 : 1

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1
    }
  })

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10)
}
PasswordPopover.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  error: PropTypes.string,
  star: PropTypes.bool,
  width: PropTypes.string,
  disabled: PropTypes.bool,
}
function PasswordPopover({ value, setValue, error, star = false, width = rem(350), disabled }) {
  const [popoverOpened, setPopoverOpened] = useState(false)
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ))

  const strength = getStrength(value)
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red"

  return (
    <Box>
      <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: "pop" }}>
        <Popover.Target>
          <div onFocusCapture={() => setPopoverOpened(true)} onBlurCapture={() => setPopoverOpened(false)}>
            <PasswordInput
              disabled={disabled}
              leftSection={<IconLock style={{ height: rem(18), width: rem(18) }} />}
              error={error}
              withAsterisk={star}
              label="Mot de passe"
              placeholder="Mot de passe"
              value={value}
              w={width}
              onChange={(event) => setValue(event.currentTarget.value)}
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <Progress color={color} value={strength} size={5} mb="xs" />
          <PasswordRequirement label="Inclure au moins 8 caractères" meets={value.length >= 8} />
          {checks}
        </Popover.Dropdown>
      </Popover>
    </Box>
  )
}

export default PasswordPopover
