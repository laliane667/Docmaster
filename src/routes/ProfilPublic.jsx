import { TextInput, Avatar, Text, Paper, Group, Button, Textarea, Stack, rem } from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconAt } from "@tabler/icons-react"
import { useSetUser, useUser } from "../Context"
import { put, get } from "../tools/Request"
import { useNavigate, useLoaderData } from "react-router-dom"
import { NotifInfo, NotifSuccess } from "../components/Notification"
import useNextRenderNavigate from "../tools/useNextRenderNavigate"

export async function loaderProfilPublic(params) {
  const profil = await get(`/${params.role}`, { token: params.token })
  return profil
}

export default function ProfilPublic() {
  const profil = useLoaderData()
  const user = useUser()
  const navigate = useNavigate()

  return (
    <>
      <Stack align="center">
        <Paper radius="md" p="xl" m="sm" withBorder w="100%" maw={400}>
          <Avatar
            color="black"
            variant="filled"
            src={profil.photo}
            alt={profil.role === "student" ? `${profil.firstName} ${profil.lastName}` : profil.name}
            radius="sm"
            size={100}
            style={{ margin: "auto" }}
          />
          <Group position="center" mt="sm">
            <Text size="lg" weight={700}>
              {profil.role === "student" ? `${profil.firstName} ${profil.lastName}` : profil.name}
            </Text>
            <Text size="sm" color="gray">
              {profil.email}
            </Text>
          </Group>
          <Stack mt="md" gap="sm">
            <Text size="sm" color="gray">
              {profil.city}
            </Text>
          </Stack>
          <Stack mt="md" gap="sm">
            <Text size="sm" color="gray">
              {profil.description}
            </Text>
          </Stack>
          {profil._id === user.id && (
            <Button variant="light" color="blue" fullWidth onClick={() => navigate(`/profil/edit`)} style={{ marginTop: rem(20) }}>
              Modifier mon profil
            </Button>
          )}
        </Paper>
      </Stack>
    </>
  )
}
