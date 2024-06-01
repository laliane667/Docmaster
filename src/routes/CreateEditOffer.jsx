import { TextInput, Text, Paper, Group, Button, Textarea, Stack, MultiSelect, NumberInput, Modal } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { useUser } from "../Context"
import { put, get, post, del } from "../tools/Request"
import { useLoaderData } from "react-router-dom"
import { NotifInfo, NotifSuccess } from "../components/Notification"
import useNextRenderNavigate from "../tools/useNextRenderNavigate"
import { SECTORS } from "../tools/Constants"
import { useState } from "react"

export async function loaderCreateEditOffer(params) {
  let offer = null
  if (params && params.id) {
    offer = await get(`/offer`, { id: params.id })
    if (offer === null) offer = "notfound"
  }
  return { offer, offerId: params && params.id }
}


export default function CreateEditOffer() {
  const { offer, offerId } = useLoaderData()
  const editing = offer ? true : false
  const offerNotFound = offer === "notfound"
  const user = useUser()
  const nextRenderNavigate = useNextRenderNavigate()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const form = useForm({
    initialValues: {
      title: offer?.title || "",
      description: offer?.description || "",
      sector: offer?.sector || "",
      startDate: offer?.startDate ? new Date(offer.startDate) : null,
      endDate: offer?.endDate ? new Date(offer.endDate) : null,
      workingHours: offer?.workingHours || "",
    },

    validate: {
      title: (value) => (value.length > 50 ? "Votre titre ne peut pas faire plus de 50 caractères." : null),
      description: (value) => (value.length > 500 ? "Votre description ne peut pas faire plus de 500 caractères." : null),
      workingHours: (value) => (value < 2 || value > 40 ? "Veuillez entrer un nombre d'heures de travail entre 2 et 40." : null),
    },
  })

  async function handleSubmit() {
    let res = null
    if (editing) {
      res = await put(`/offer`, { ...form.values, token: user.token, id: offer._id, ownerId: user.id })
    } else {
      res = await post(`/offer`, { ...form.values, token: user.token, ownerId: user.id })
    }
    if (res) {
      NotifSuccess(editing ? "Modification enregistrée" : "Offre créée")
      nextRenderNavigate(`/offerdetails/${res._id}`)
    }
  }

  async function handleCancel() {
    form.reset()
    NotifInfo("Modification annulée")
    nextRenderNavigate(`/offerdetails/${offerId}`)
  }

  async function handleDelete() {
    const res = await del(`/offer`, { id: offer._id, token: user.token, ownerId: user.id })
    if (res) {
      NotifSuccess("Offre supprimée")
      nextRenderNavigate(`/myoffers`)
    }
  }

  return (
    <>
      <Stack align="center">
        <Paper radius="md" p="xl" m="sm" withBorder w="100%" maw={400}>
          {offerNotFound ? (
            <Text>Offre non trouvée</Text>
          ) : (
            <form onSubmit={form.onSubmit(() => handleSubmit())}>
              <Text size="lg" fw={500}>
                {editing ? "Modifier l'offre" : "Créer une offre"}
              </Text>
              <Stack mt="sm" gap="xs">
                <TextInput
                  label="Titre"
                  placeholder="Titre"
                  value={form.values.title}
                  onChange={(event) => form.setFieldValue("title", event.currentTarget.value)}
                  error={form.errors.title}
                />
                <Textarea
                  label="Description"
                  placeholder="Description"
                  value={form.values.description}
                  onChange={(event) => form.setFieldValue("description", event.currentTarget.value)}
                  error={form.errors.description}
                  autosize
                  minRows={3}
                />
                <MultiSelect
                  label="Secteur"
                  data={SECTORS}
                  value={form.values.sector !== "" ? form.values.sector.split(",") : []}
                  onChange={(value) => form.setFieldValue("sector", value.toString())}
                  error={form.errors.sector}
                />
                <NumberInput
                  label="Heures de travail"
                  value={form.values.workingHours}
                  onChange={(value) => form.setFieldValue("workingHours", value)}
                  min={2}
                  max={40}
                />
                <DatePickerInput
                  type="range"
                  label="Pick dates range"
                  placeholder="Pick dates range"
                  value={[form.values.startDate, form.values.endDate]}
                  onChange={(value) => {
                    form.setFieldValue("startDate", value[0])
                    form.setFieldValue("endDate", value[1])
                  }}
                />
              </Stack>
              <Group justify="space-between" mt="xl">
                <Button onClick={() => handleCancel()}>Annuler</Button>
                <Button type="submit">{editing ? "Modifier" : "Créer"}</Button>
              </Group>
              <Group justify="space-between" mt="xl">
                <Modal
                  opened={openDeleteModal}
                  onClose={() => setOpenDeleteModal(false)}
                  withCloseButton={false}
                  centered
                  overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                  }}>
                  <Text>Êtes-vous sûr de vouloir supprimer cette offre ?</Text>
                  <Group mt="lg" justify="space-between">
                    <Button onClick={() => setOpenDeleteModal(false)}>Annuler</Button>
                    <Button color="red" onClick={() => handleDelete()}>
                      Supprimer
                    </Button>
                  </Group>
                </Modal>
                <Button fullWidth color="red" size="compact-sm" variant="light" mt="xs" onClick={() => setOpenDeleteModal(true)}>
                  Supprimer l&apos;offre
                </Button>
              </Group>
            </form>
          )}
        </Paper>
      </Stack>
    </>
  )
}
