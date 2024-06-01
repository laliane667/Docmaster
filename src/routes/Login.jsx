import { useForm } from "@mantine/form"
import { TextInput, PasswordInput, Text, Paper, Group, Button, Divider, Anchor, Stack, rem } from "@mantine/core"
import GoogleIcon from "../assets/GoogleIcon.jsx"
import { Link } from "react-router-dom"
import { IconLock, IconAt } from "@tabler/icons-react"
import { useSetUser } from "../Context"
import { post } from "../tools/Request"
import { NotifSuccess } from "../components/Notification"
import useNextRenderNavigate from "../tools/useNextRenderNavigate"

export default function Login() {
  const setUser = useSetUser()
  const nextRenderNavigate = useNextRenderNavigate()

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Email invalide"),
      password: (val) => (val.length <= 6 ? "Password should include at least 6 characters" : null),
    },
  })

  async function handleSubmit() {
    const res = await post("/login", form.values)
    if (!res) return
    console.log(res)
    setUser({
      role: res.role,
      id: res._id,
      token: res.token,
      fullName: res.role === "user" ? `${res.firstName} ${res.lastName}` : res.name,
      email: res.email,
      photo: res.photo,
      score: res.score,
      grade: res.grade
    })
    NotifSuccess("Bienvenue sur XPME", "Vous êtes connecté")
    nextRenderNavigate("/")
  }

  return (
    <Stack align="center">
      <Paper radius="md" p="xl" m="sm" withBorder w="100%" maw={400}>
        <Text size="lg" fw={500}>
          Bienvenu sur XPME
        </Text>

        <Stack mb="md" mt="md" align="center">
          <Button leftSection={<GoogleIcon />} variant="default">
            Google
          </Button>
        </Stack>

        <Divider label="Continuer avec mon email" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(() => handleSubmit())}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="exemple@gmail.com"
              value={form.values.email}
              onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
              error={form.errors.email}
              leftSection={<IconAt style={{ height: rem(18), width: rem(18) }} />}
            />

            <PasswordInput
              required
              label="Mot de passe"
              placeholder="Votre mot de passe"
              value={form.values.password}
              onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
              error={form.errors.password}
              leftSection={<IconLock style={{ height: rem(18), width: rem(18) }} />}
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Link to="/register">
              <Anchor component="button" type="button" c="dimmed" size="xs">
                Inscription
              </Anchor>
            </Link>
            <Button type="submit">Connexion</Button>
          </Group>
        </form>
      </Paper>
    </Stack>
  )
}
