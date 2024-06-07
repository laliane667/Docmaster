import React from "react";
import { Card, Title, rem, Divider, Center, Image, Badge } from "@mantine/core";
import { TextInput, Text, Paper, Group, Button, Textarea, Stack, MultiSelect, NumberInput, Modal } from "@mantine/core"
import { IconRadiusBottomLeft, IconChevronDown, IconEdit, IconCalendar, IconTrendingUp, IconVocabulary, IconListNumbers } from "@tabler/icons-react";

import { DatePickerInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { useUser } from "../Context"
import { put, get, post, del } from "../tools/Request"
import { useLoaderData } from "react-router-dom"
import { NotifInfo, NotifSuccess } from "../components/Notification"
import useNextRenderNavigate from "../tools/useNextRenderNavigate"
import { SECTORS } from "../tools/Constants"
import { useState } from "react"


import gitHub from "../assets/typeImage/github.png"

export async function loaderCreateEditProject(params) {
  let project = null
  if (params && params.id) {
    project = await get(`/project`, { id: params.id })
    if (project === null) project = "notfound"
  }
  return { project, projectId: params && params.id }
}
export default function ProjectEditCreate() {
  const { project, projectId } = useLoaderData()
  const editing = project ? true : false
  const projectNotFound = project === "notfound"
  const user = useUser()
  const nextRenderNavigate = useNextRenderNavigate()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const form = useForm({
    initialValues: {
      name: project?.name || "",
      description: project?.description || "",
    },

    validate: {
      name: (value) => (value.length > 50 ? "Votre titre ne peut pas faire plus de 50 caractères." : null),
      description: (value) => (value.length > 200 ? "Votre description ne peut pas faire plus de 200 caractères." : null),
    },
  })

  async function handleSubmit() {
    let res = null
    if (editing) {
      res = await put(`/project`, { ...form.values, token: user.token, owner: user.id })
    } else {
      res = await post(`/project`, { ...form.values, token: user.token, owner: user.id })
    }
    if (res) {
      NotifSuccess(editing ? "Modification enregistrée" : "Projet créé")
      nextRenderNavigate(`/project/${res._id}`)
    }
  }

  async function handleCancel() {
    form.reset()
    NotifInfo("Modification annulée")
    nextRenderNavigate(`/project/${projectId}`)
  }

  async function handleDelete() {
    const res = await del(`/project`, { id: offer._id, token: user.token, ownerId: user.id })
    if (res) {
      NotifSuccess("Offre supprimée")
      nextRenderNavigate(`/myoffers`)
    }
  }
  return (
    <>
      <Stack align="center">
        <Paper radius="md" p="xl" m="sm" withBorder w="100%" maw={400}>
          {projectNotFound ? (
            <Text>Projet non trouvé</Text>
          ) : (
            <form onSubmit={form.onSubmit(() => handleSubmit())}>
              <Text size="lg" fw={500}>
                {editing ? "Modifier le projet" : "Créer un projet"}
              </Text>
              <Stack mt="sm" gap="xs">
                <TextInput
                  label="Nom"
                  placeholder="Nom"
                  value={form.values.title}
                  onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
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
                  <Text>Êtes-vous sûr de vouloir supprimer ce projet ?</Text>
                  <Group mt="lg" justify="space-between">
                    <Button onClick={() => setOpenDeleteModal(false)}>Annuler</Button>
                    <Button color="red" onClick={() => handleDelete()}>
                      Supprimer
                    </Button>
                  </Group>
                </Modal>
                <Button fullWidth color="red" size="compact-sm" variant="light" mt="xs" onClick={() => setOpenDeleteModal(true)}>
                  Supprimer le projet
                </Button>
              </Group>
            </form>
          )}
        </Paper>
      </Stack>
    </>
  )
}
