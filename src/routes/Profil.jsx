import { TextInput, Avatar, Text, Paper, Group, Button, Textarea, Autocomplete, Stack, rem } from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconAt } from "@tabler/icons-react"
import { useSetUser, useUser } from "../Context"
import { put, get } from "../tools/Request"
import { useLoaderData, redirect } from "react-router-dom"
import { NotifInfo, NotifSuccess } from "../components/Notification"
import useNextRenderNavigate from "../tools/useNextRenderNavigate"
import frenchCities from "../assets/french-cities.json";

export async function loaderProfil(user) {
  if (!user.token) return redirect("/login")
  const profil = await get(`/${user.role}`, { token: user.token })
  return profil
}

export default function Profil() {
  const profil = useLoaderData()
  const setUser = useSetUser()
  const user = useUser()
  const nextRenderNavigate = useNextRenderNavigate()

  const form = useForm({
    initialValues: {
      email: profil.email,
      name: profil.name || "",
      firstName: profil.firstName || "",
      lastName: profil.lastName || "",
      description: profil.description || "",
      city: profil.city || "",
      photo: profil.photo || "",
    },

    validate: {
      name: (value) => (profil.role === "company" && value === "" ? "Veuillez entrer un nom" : null),
      firstName: (value) => (profil.role === "student" && value === "" ? "Veuillez entrer un prénom" : null),
      lastName: (value) => (profil.role === "student" && value === "" ? "Veuillez entrer un nom" : null),
      description: (value) => (value.length > 500 ? "Votre description ne peut pas faire plus de 500 caractères." : null),
      city: (value) => (value.length > 500 ? "Votre description ne peut pas faire plus de 500 caractères." : null),
    },
  })

  async function handleSubmit() {
    const res = await put(`/${user.role}`, { ...form.values, token: user.token })
    if (!res) return
    setUser({
      role: res.role,
      id: res._id,
      token: res.token,
      fullName: res.role === "student" ? `${res.firstName} ${res.lastName}` : res.name,
      email: res.email,
      photo: res.photo,
    })
    NotifSuccess("Modification enregistrée")
    nextRenderNavigate("/profil")
  }

  async function handleCancel() {
    form.reset()
    NotifInfo("Modification annulée")
    nextRenderNavigate("/profil")
  }

  return (
    <>
      <Stack align="center">
        <Paper radius="md" p="xl" m="sm" withBorder w="100%" maw={400}>
          <form onSubmit={form.onSubmit(() => handleSubmit())}>
            <Text size="lg" fw={500}>
              Mon profil
            </Text>
            <Group my="xs" w="100%">
              <Avatar src={form.values.photo} variant="filled" radius="sm" size={70} color="black" />
              <TextInput
                label="URL Photo"
                value={form.values.photo}
                onChange={(event) => form.setFieldValue("photo", event.currentTarget.value)}
                style={{ flexGrow: 1 }}
              />
            </Group>
            <TextInput label="Email" value={form.values.email} disabled leftSection={<IconAt style={{ height: rem(18), width: rem(18) }} />} />
            {profil.role === "company" && (
              <TextInput
                required
                label="Nom de l'entreprise"
                placeholder="Nom de l'entreprise"
                value={form.values.name}
                onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
                error={form.errors.name}
              />
            )}
            {profil.role === "student" && (
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
            {frenchCities && (
              <Autocomplete
                label="Ville"
                placeholder="Sélectionnez une ville"
                data={frenchCities.cities}
                value={form.values.city}
                onChange={(value) => form.setFieldValue("city", value)}
                error={form.errors.city}
                limit={15}
              />
            )}



            <Textarea
              label="Description"
              placeholder="Description"
              value={form.values.description}
              onChange={(event) => form.setFieldValue("description", event.currentTarget.value)}
              error={form.errors.description}
              autosize
              minRows={3}
            />
            <Group justify="space-between" mt="xl">
              <Button onClick={() => handleCancel()}>Annuler</Button>
              <Button type="submit">Enregister</Button>
            </Group>
          </form>
        </Paper>
      </Stack>
    </>
  )
}
