import React from "react";
import { useEffect, useState } from "react"

import { Card, Title, rem, Divider, Center, Image, Badge } from "@mantine/core";
import { TextInput, Text, Paper, Group, Button, Switch, Stack, Flex, Box, FileInput, NumberInput, Modal } from "@mantine/core"
import { IconFileCheck, IconFileUpload, IconEdit, IconCalendar, IconTrendingUp, IconVocabulary, IconListNumbers } from "@tabler/icons-react";

import { DatePickerInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { useUser } from "../Context"
import { put, get, post, del } from "../tools/Request"
import { useLoaderData } from "react-router-dom"
import { NotifInfo, NotifSuccess } from "../components/Notification"
import useNextRenderNavigate from "../tools/useNextRenderNavigate"
import { SECTORS } from "../tools/Constants"
import { Grid, /* ...autres imports... */ } from "@mantine/core";
import { Tabs } from "@mantine/core";

import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

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
  const [projectSwitch, setProjectSwitch] = useState(false);
  const [documentationSwitch, setDocumentationSwitch] = useState(false);

  const fileInputRef = useRef(null);
  const handleChooseClick = () => {
    fileInputRef.current.click();
  };

  //Tree

  const [content, setContent] = useState("");
  const isLargeScreen = useMediaQuery(
    { minDeviceWidth: 1000 }
  )

  function Summary({ name }) {
    const [summaryContent, setSummaryContent] = useState("");

    useEffect(() => {
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < name.length - 1) {
          setSummaryContent((prevContent) => prevContent + name[index]);
          index++;
          requestAnimationFrame(displayContent);
        } else {
          clearInterval(intervalId);
        }
      }, 50);

      const displayContent = () => {

      };

      requestAnimationFrame(displayContent);
    }, [name]);

    return <summary> {summaryContent}</summary>;
  }




  const handleUpload = () => {
    // ... code pour gérer l'upload du répertoire ...

    // Contenu à afficher (vous devriez générer cela dynamiquement en fonction du répertoire uploadé)
    const contentToDisplay = [
      {
        name: 'minecraft',
        children: ['launch_server.sh', 'start.sh', 'test'],
      },
      {
        name: 'test',
        children: ['ok.sh', 'super.sh'],
      },
      {
        name: 'sensors',
        children: ['get-temperatures.sh', 'nohup.out', 'start.sh', 'temperatures.txt'],
      },
    ];

    // Effacer le contenu précédent
    setContent([]);

    // Afficher le nouveau contenu progressivement
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < contentToDisplay.length) {
        const folder = contentToDisplay[index];

        const folderElement = (
          <Group bg="inverted" w="fit-content" my="0" style={{ borderRadius: "0.5rem", border: "solid #131313 0.1px", alignItems: "flex-start" }}>
            <Text mt="3px" ml="0.5rem">49</Text>
            <details key={folder.name}>
              <Summary name={folder.name} />
              <ul>
                {folder.children.map((child) => (
                  <li key={child}>{child}</li>
                ))}
              </ul>
            </details>
            {/* <Button variant="subtle" onClick={() => handleCancel()}>Ignorer</Button> */}
          </Group>

        );
        setContent((prevContent) => [...prevContent, folderElement]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 350); // Ajustez ce délai pour contrôler la vitesse d'affichage
  };


  /* displayContent(
    [
      {
        name: 'minecraft',
        type: 'folder',
        children: [
          { name: 'launch_server.sh' },
          { name: 'start.sh' },
        ],
      },
      {
        name: 'sensors',
        type: 'folder',
        children: [
          { name: 'get-temperatures.sh' },
          { name: 'nohup.out' },
          { name: 'start.sh' },
          { name: 'temperatures.txt' },
        ],
      },
    ]) */



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
    <Stack align="center">
      <Paper radius="md" withBorder miw="75%" p={isLargeScreen ? "lg" : "xs"} maw="100%">
        <Tabs color="primary" defaultValue="general" orientation={isLargeScreen ? 'horizontal' : 'vertical'} maw="100%">
          {false ? (
            <Tabs.List style={{ display: 'flex', flexDirection: 'column' }}>
              <Tabs.Tab value="general">Aperçu général</Tabs.Tab>
              <Tabs.Tab value="documentation">Documentation</Tabs.Tab>
              <Tabs.Tab value="settings">Paramètres</Tabs.Tab>
            </Tabs.List>
          ) : (
            <Tabs.List>
              <Tabs.Tab value="general">Aperçu général</Tabs.Tab>
              <Tabs.Tab value="documentation">Documentation</Tabs.Tab>
              <Tabs.Tab value="settings">Paramètres</Tabs.Tab>
            </Tabs.List>
          )}


          <Tabs.Panel value="general" pt="xs">
            {projectNotFound ? (
              <Text>Projet non trouvé</Text>
            ) : (
              <Text>
                OKOK
              </Text>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="settings">
            <input style={{ opacity: '0', height: '0', width: "0" }} ref={fileInputRef} directory="" webkitdirectory="" type="file" />
            <Stack maw={isLargeScreen ? "100%" : "55vw"} px="xs">
              <Text size="lg" fw={500}>
                Général
              </Text>
              <form onSubmit={form.onSubmit(() => handleSubmit())}>
                <Stack>
                  <Group align="flex-end">
                    <TextInput
                      label="Nom du projet"
                      placeholder="Nom"
                      value={form.values.name}
                      onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
                      error={form.errors.name}
                    />
                    <Button>Renomer</Button>

                  </Group>

                </Stack>


              </form>
              <Divider mx="xl" fw="xs" />

              <Group wrap={isLargeScreen ? "nowrap" : "wrap"}>
                <FileInput

                  placeholder="Aucun répertoire choisi"
                  //value={selectedFile || undefined}
                  onClick={handleChooseClick}
                  //onChange={handleChooseClick}
                  rightSection={true && <IconFileCheck color="grey" />}
                  error={null}
                //disabled={!selectedFile ? false : report ? (report.shared ? true : false) : false}
                />

                <Button variant="subtle" onClick={handleChooseClick}>
                  Choisir
                </Button>
                <Button variant="light" onClick={handleUpload}>
                  Enregistrer
                </Button>
              </Group>
              <pre>{content}</pre>
              <Group mt="xs">
                <Text>Projet</Text>
                <Switch checked={projectSwitch} onChange={(event) => setProjectSwitch(event.currentTarget.checked)} />
                <Button onClick={() => { /* ... code pour gérer le clic sur le bouton "Modifier" ... */ }}>Modifier</Button>
              </Group>
              <Group mt="xs">
                <Text>Documentation</Text>
                <Switch checked={documentationSwitch} onChange={(event) => setDocumentationSwitch(event.currentTarget.checked)} />
                <Button onClick={() => { /* ... code pour gérer le clic sur le bouton "Modifier" ... */ }}>Modifier</Button>
              </Group>


              <Divider />
              <Text size="lg" fw={500}>
                Danger zone
              </Text>
              <Button color="red" variant="light" onClick={() => setOpenDeleteModal(true)}>
                Supprimer le projet
              </Button>
            </Stack>



          </Tabs.Panel>
        </Tabs>


      </Paper>
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
    </Stack>

  )
}
