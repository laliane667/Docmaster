import React from "react";
import { useEffect, useState } from "react"

import { Card, Title, rem, Divider, Center, Image, Badge } from "@mantine/core";
import { TextInput, Text, Paper, Group, Button, Switch, Stack, Accordion, Flex, Box, FileInput, NumberInput, Modal } from "@mantine/core"
import { IconFileCheck, IconFileUpload, IconEdit, IconCalendar, IconPlus, IconChevronRight, IconSearch } from "@tabler/icons-react";

import { DatePickerInput } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { useUser } from "../Context"
import { put, get, post, del, fileUpload } from "../tools/Request"
import { useLoaderData } from "react-router-dom"
import { NotifInfo, NotifSuccess } from "../components/Notification"
import useNextRenderNavigate from "../tools/useNextRenderNavigate"
import { SECTORS } from "../tools/Constants"
import { Grid, /* ...autres imports... */ } from "@mantine/core";
import { Tabs } from "@mantine/core";

import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

import gitHub from "../assets/typeImage/github.png"
import classes from '../css/ProjectEditCreate.module.css';

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
  const [nameChanged, setNameChanged] = useState(false);
  const [documentationSwitch, setDocumentationSwitch] = useState(false);
  let test = "Test"
  const [rootName, setRootName] = useState(null);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const fileInputRef = useRef(null);
  const handleChooseClick = () => {
    fileInputRef.current.click();
  };

  function printTree(node) {
    console.log(node.name, node.type);
    if (node.type === 'folder' && node.children && node.children.length > 0) {
      node.children.forEach(child => printTree(child));
    }
  }
  const [parents, setParents] = useState([]);

  function processFiles(files) {
    setParents([]);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.webkitRelativePath) {
        const pathParts = file.webkitRelativePath.split('/');
        const fileName = pathParts.pop();
        const folderName = pathParts.join('/');

        // Trouver ou créer le dossier parent
        let parent = parents.find(p => p.name === folderName);
        if (!parent) {
          parent = { name: folderName, type: 'folder', children: [] };
          parents.push(parent);
        }

        if (file.type === '') {
          parent.children.push({ name: fileName, type: 'folder', children: [] });
        } else {
          parent.children.push({ name: fileName, type: 'file' });
        }
      }
    }
    setParents(parents);
  }

  const handleFileChange = (event) => {
    const files = event.target.files;
    processFiles(files);
    printTree(parents)
    launchTreeGeneration(parents);
    setSelectedDirectory(files);
  };


  const handleSave = async () => {
    await handleFileSubmit();
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();
    formData.append("id", project._id);

    // Ajoutez les fichiers à formData avec leur chemin d'accès relatif
    for (let i = 0; i < selectedDirectory.length; i++) {
      const file = selectedDirectory[i];
      const relativePath = file.webkitRelativePath || file.mozFullPath || file.name;
      formData.append(relativePath, file);
    }

    if (project._id) {
      const response = await fileUpload("/project/upload", {}, formData);
      console.log("Project upload")
      if (response) {
        console.log("Response received :")
        console.log(response)
      }
    }
  };




  //Tree

  const [content, setContent] = useState("");
  const isLargeScreen = useMediaQuery(
    { minDeviceWidth: 1000 }
  )


  function Summary({ name, ml }) {
    const [summaryContent, setSummaryContent] = useState("");

    useEffect(() => {
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < name.length) {
          setSummaryContent((prevContent) => {
            const newContent = prevContent + name[index];
            index++;
            requestAnimationFrame(displayContent);
            return newContent;
          });
        } else {
          clearInterval(intervalId);
        }
      }, 75);

      const displayContent = () => {

      };
    }, [name]);


    return <summary style={{ marginLeft: ml }}> {summaryContent}</summary>;
  }

  let nonNamedFileCount = 0;
  let nonNamedFolderCount = 0;
  function generateUniqueValue(item, parentValue = "") {
    if (item.type === "file") {
      if (item.name != '') {
        nonNamedFileCount++;
      }
      return parentValue + (item.name != '' ? item.name : "nn" + nonNamedFileCount);
    }

    if (item.name != '') {
      nonNamedFolderCount++;
    }
    return parentValue + (item.name != '' ? item.name : "nn" + nonNamedFolderCount);
  }

  let uniqueCount = 0;
  function generateUniqueId() {
    uniqueCount++;
    return Date.now().toString(36) + Math.random().toString(36).substr(2) + uniqueCount;
  }


  const generateTreeElement = (item, level = 0) => {
    const uniqueValue = generateUniqueId();

    console.log("Id: " + uniqueValue)
    console.log("Item childrens: " + item.children)
    const indentation = <Text mt="3px" ml={rem(level * 15)}>{level > 0 ? "   " : "       "}</Text>;
    const indentValue = level + '0px';
    if (item.type === "file") {
      return (
        <Group key={uniqueValue} bg="inverted" w="fit-content" mt="3px" mb="2px" style={{ borderRadius: "0.5rem", alignItems: "flex-start" }}>
          {indentation}
          <Summary name={item.name} />
        </Group>
      );
    }

    return (
      <Accordion.Item key={uniqueValue} value={uniqueValue} ml={indentValue}>
        <Accordion.Control >
          {indentation}
          <Summary name={(item.name && item.name != '') ? item.name : "No name"} />
        </Accordion.Control>
        {(item.children && item.children.length > 0) && (
          <Accordion.Panel>
            <ul>
              {item.children.map((child) => generateTreeElement(child, level + 1))}
            </ul>
          </Accordion.Panel>
        )}
      </Accordion.Item>
    );
  };




  const launchTreeGeneration = (contentToDisplay) => {
    // ... code pour gérer l'upload du répertoire ...
    console.log(contentToDisplay)
    // Contenu à afficher (vous devriez générer cela dynamiquement en fonction du répertoire uploadé)
    const contentToDisplay2 = [
      {
        name: 'minecraft',
        type: 'folder',
        children: [
          {
            name: 'src',
            type: 'folder',
            children: [
              { name: 'launch_server.sh', type: 'file' },
              { name: 'start.sh', type: 'file' },
            ]
          },
          { name: 'start.sh', type: 'file' },
        ],
      },
      {
        name: 'sensors',
        type: 'folder',
        children: [
          { name: 'get-temperatures.sh', type: 'file' },
          { name: 'nohup.out', type: 'file' },
          { name: 'start.sh', type: 'file' },
          { name: 'temperatures.txt', type: 'file' },
          { name: 'Test', type: 'folder', children: [] },
        ],
      },
    ];

    console.log(contentToDisplay2)
    // Effacer le contenu précédent
    setContent([]);
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < contentToDisplay.length) {
        const item = contentToDisplay[index];

        const itemElement = generateTreeElement(item);
        setContent((prevContent) => [...prevContent, itemElement]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 350);
  };

  const { project, projectId } = useLoaderData()
  const editing = project ? true : false
  const projectNotFound = project === "notfound"
  const user = useUser()
  const nextRenderNavigate = useNextRenderNavigate()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const accordion = React.useRef(null);
  const treeAccordion = React.useRef(null);

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
            <input onChange={handleFileChange} style={{ opacity: '0', height: '0', width: "0" }} ref={fileInputRef} directory="" webkitdirectory="" type="file" />
            <Stack maw={isLargeScreen ? "100%" : "55vw"} px="xs" >
              <Accordion
                ref={accordion}
                defaultValue="general"
                classNames={{ chevron: classes.chevron }}
                chevron={<IconPlus className={classes.icon} />}
              >
                <Accordion.Item value="general">
                  <Accordion.Control>
                    <Text style={{ width: "fit-content" }}>Général</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <form onSubmit={form.onSubmit(() => handleSubmit())}>
                      <Stack px="xl" py="md" gap="xl">

                        <Stack gap="0">
                          <Text mb="sm">Nom du projet :</Text>
                          <TextInput
                            w="50%"
                            placeholder="Nom"
                            value={form.values.name}
                            onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
                            error={form.errors.name}
                          />
                        </Stack>

                        <Group>

                          <FileInput
                            w="50%"
                            placeholder={selectedDirectory ? rootName : "Aucun répertoire choisi"}
                            onChange={handleFileChange}
                            rightSection={selectedDirectory ? <IconFileCheck color="green" /> : null}
                            error={null}
                            radius="xl"
                            styles={{ input: { cursor: "pointer" } }}
                            onClick={(event) => {
                              event.preventDefault();
                              fileInputRef.current.click();
                            }}
                          />
                          {selectedDirectory ? (
                            <Button w="fit-content" onClick={handleSave}>Enregister</Button>
                          ) : (
                            <Button variant="light" w="fit-content" px="5px" mr="0" onClick={handleChooseClick}><IconSearch /></Button>
                          )}
                          <Button variant="subtle" c="red" onClick={handleChooseClick}>
                            Supprimer
                          </Button>
                        </Group>

                        <Accordion
                          multiple
                          ref={treeAccordion}
                          variant="contained" radius="md" chevronPosition="left"
                          classNames={{ item: classes.item, content: classes.content, control: classes.control }}
                        >
                          {content}
                        </Accordion>

                        <Stack gap="0">
                          <Text mb="sm">Services activés :</Text>

                          <Group justify="space-between">
                            <Group>
                              <Text>Documentation</Text>
                              <Switch checked={projectSwitch} onChange={(event) => setProjectSwitch(event.currentTarget.checked)} />
                            </Group>
                            <Button color="secondary" variant="transparent"><IconChevronRight /></Button>
                          </Group>
                          <Divider color="inverted" />

                          <Group justify="space-between">
                            <Group>
                              <Text>Suivi de projet</Text>
                              <Switch checked={projectSwitch} onChange={(event) => setProjectSwitch(event.currentTarget.checked)} />
                            </Group>
                            <Button color="secondary" variant="transparent"><IconChevronRight /></Button>
                          </Group>
                          <Divider color="inverted" />
                        </Stack>



                        {/* <pre>{content}</pre> */}
                        <Group align="center" w="100%">
                          <Button w="fit-content" mx="auto">
                            Enregistrer les modifications
                          </Button>
                        </Group>
                      </Stack>


                    </form>
                  </Accordion.Panel>
                </Accordion.Item>

                {/* <Accordion.Item value="location">
                  <Accordion.Control>
                    Emplacement du projet
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack px="xl" wrap={isLargeScreen ? "nowrap" : "wrap"}>


                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item> */}

                <Accordion.Item value="danger">
                  <Accordion.Control>
                    Danger zone
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Button color="red" variant="light" onClick={() => setOpenDeleteModal(true)}>
                      Supprimer le projet
                    </Button>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>


              {/* 
              <Group >
                <Text size="lg" fw={500}>
                  Général
                </Text>
                <Button color="secondary" variant="transparent"><IconChevronRight style={{ transform: "rotate(90deg)" }} /></Button>
              </Group>

              <Divider my="lg" size={1} color="secondary" style={{ flexGrow: "1" }} />

              <Group >
                <Text size="lg" fw={500}>
                  Emplacement du projet
                </Text>
                <Button color="secondary" variant="transparent"><IconChevronRight /></Button>
              </Group>


              <Divider my="lg" size={1} color="secondary" style={{ flexGrow: "1" }} />



              <Group >
                <Text size="lg" fw={500}>
                  Danger zone
                </Text>
                <Button color="secondary" variant="transparent"><IconChevronRight style={{ transform: "rotate(90deg)" }} /></Button>
              </Group> */}

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
