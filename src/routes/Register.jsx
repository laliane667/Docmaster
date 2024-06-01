import { useForm } from "@mantine/form"
import { TextInput, PasswordInput, Text, Paper, Group, Button, Divider, Anchor, Stack, rem, Center, Radio } from "@mantine/core"
import GoogleIcon from "../assets/GoogleIcon"
import PasswordPopover from "../components/PasswordPopover"
import { Link } from "react-router-dom"
import { IconLock, IconAt } from "@tabler/icons-react"
import { useSetUser } from "../Context"
import { post } from "../tools/Request"
import { NotifSuccess } from "../components/Notification"
import useNextRenderNavigate from "../tools/useNextRenderNavigate"

function checkPassword(password) {
  // eslint-disable-next-line
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/
  return regex.test(password)
}

export default function Register() {
  const setUser = useSetUser()
  const nextRenderNavigate = useNextRenderNavigate()

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      name: "",
      firstName: "",
      lastName: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Email invalide"),
      password: (val) => (!checkPassword(val) ? "Votre mot de passe ne contient pas tout les critères requis" : null),
      confirmPassword: (value, values) => (value !== values.password ? "Les mots de passes ne correspondent pas" : null),
      role: (value) => (value === "" ? "Veuillez choisir un rôle" : null),
      name: (value, values) => (values.role === "company" && value === "" ? "Veuillez entrer un nom" : null),
      firstName: (value, values) => (values.role === "user" && value === "" ? "Veuillez entrer un prénom" : null),
      lastName: (value, values) => (values.role === "user" && value === "" ? "Veuillez entrer un nom" : null),
    },
  })

  async function handleSubmit() {
    const res = await post("/register", form.values)
    if (!res) return
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
    NotifSuccess(
      "Bienvenue sur XPME",
      res.role === "user"
        ? "Votre compte en temps qu'étudiant à bien été créé nous vous remercions de votre confiance."
        : "Votre compte en temps qu'entreprise à bien été créé nous vous remercions de votre confiance.",
      8000
    )
    nextRenderNavigate("/profil")
  }

  return (
    <Center>
      <Paper radius="md" p="xl" m="sm" withBorder w="100%" maw={400}>
        <Text size="lg" fw={500}>
          Bienvenu sur Docmaster
        </Text>

        <Stack mb="md" mt="md" align="center">
          <Button radius="xl" leftSection={<GoogleIcon />} variant="default">
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
            <PasswordPopover
              value={form.values.password}
              setValue={(value) => form.setFieldValue("password", value)}
              error={form.errors.password}
              star
              width="auto"
            />
            <PasswordInput
              required
              label="Confirmation du mot de passe"
              placeholder="Votre mot de passe"
              value={form.values.confirmPassword}
              onChange={(event) => form.setFieldValue("confirmPassword", event.currentTarget.value)}
              error={form.errors.confirmPassword}
              leftSection={<IconLock style={{ height: rem(18), width: rem(18) }} />}
            />

            <Radio.Group
              value={form.values.role}
              error={form.errors.role}
              onChange={(value) => form.setFieldValue("role", value)}
              label="Je m'inscris en tant que :"
              required>
              <Group grow m="sm">
                <Radio value="user" label="User" />
                <Radio value="company" label="Entreprise" />
              </Group>
            </Radio.Group>
            {form.values.role === "company" && (
              <TextInput
                required
                label="Nom de l'entreprise"
                placeholder="Nom de l'entreprise"
                value={form.values.name}
                onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
                error={form.errors.name}
              />
            )}
            {form.values.role === "user" && (
              <>
                <TextInput
                  required
                  label="Prénom"
                  placeholder="Prénom"
                  value={form.values.firstName}
                  onChange={(event) => form.setFieldValue("firstName", event.currentTarget.value)}
                  error={form.errors.firstName}
                />
                <TextInput
                  required
                  label="Nom"
                  placeholder="Nom"
                  value={form.values.lastName}
                  onChange={(event) => form.setFieldValue("lastName", event.currentTarget.value)}
                  error={form.errors.lastName}
                />
              </>
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Link to="/login">
              <Anchor component="button" type="button" c="dimmed" size="xs">
                Connexion
              </Anchor>
            </Link>
            <Button type="submit">Inscription</Button>
          </Group>
        </form>
      </Paper>
    </Center>
  )
}
