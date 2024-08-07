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
    //console.log(node.name, node.type);
    if (node.type === 'folder' && node.children && node.children.length > 0) {
      node.children.forEach(child => printTree(child));
    }
  }


  const [parents, setParents] = useState([{ name: '', type: 'folder', children: [] }]);

  function findOrCreateParent(path, currentParent) {
    const pathParts = path.split('/');
    let parent = currentParent;
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (part === '') continue;
      let child = parent.children.find(c => c.name === part);
      if (!child) {
        child = { name: part, type: 'folder', children: [] };
        parent.children.push(child);
      }
      parent = child;
    }
    return parent;
  }
  function getFileExtension(fileName) {
    const dotIndex = fileName.lastIndexOf('.');
    return dotIndex === -1 ? '' : fileName.slice(dotIndex + 1);
  }
  /* 
    function processFiles(files) {
      setParents([{ name: '', type: 'folder', children: [] }]);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.webkitRelativePath) {
          const pathParts = file.webkitRelativePath.split('/');
          const fileName = pathParts.pop();
          const folderName = pathParts.join('/');
  
          // Trouver ou créer le dossier parent
          let parent = findOrCreateParent(folderName, parents[0]);
  
          // Déterminer le type du fichier en fonction de son extension
          const extension = getFileExtension(fileName);
          const type = extension === '' ? 'folder' : 'file';
  
          if (type === 'folder') {
            parent.children.push({ name: fileName, type: 'folder', children: [] });
          } else {
            parent.children.push({ name: fileName, type: 'file' });
          }
        }
      }
      setParents(parents);
    }
   */

  function processFiles(files) {
    setParents([{ name: '', type: 'folder', children: [] }]);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.webkitRelativePath) {
        const pathParts = file.webkitRelativePath.split('/');
        const fileName = pathParts.pop();
        const folderName = pathParts.join('/');

        // Trouver ou créer le dossier parent
        let parent = findOrCreateParent(folderName, parents[0]);

        // Déterminer le type du fichier en fonction de son extension
        const extension = getFileExtension(fileName);
        const type = extension === '' ? 'folder' : 'file';

        if (type === 'folder') {
          parent.children.push({ name: fileName, type: 'folder', children: [] });
        } else {
          const isTextFile = isFileTextBased(file); // Vérifier si le fichier est de type texte
          parent.children.push({ name: fileName, type: 'file', text: isTextFile });
        }
      }
    }
    setParents(parents);
  }

  function isFileTextBased(file) {
    const textBasedExtensions = ['txt', 'js', 'json', 'css', 'html', 'md', 'csv', 'xml', 'yaml', 'log', 'java', 'cpp', 'cs']; // Ajouter les extensions de fichiers texte ici
    const extension = getFileExtension(file.name);
    return textBasedExtensions.includes(extension);
  }

  const handleFileChange = (event) => {
    const files = event.target.files;
    processFiles(files);
    printTree(parents[0].children) //Cet élément json est le répertoire chargé mais pas upload
    //console.log(parents[0].children)
    launchTreeGeneration(parents[0].children);
    setSelectedDirectory(files);

    const originalFolderName = files[0].webkitRelativePath.split('/')[0];
    setRootName(originalFolderName);
  };



  const handleSave = async () => {
    await handleFileSubmit();
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();
    formData.append("id", project._id);

    // Vérifier que rootName est une chaîne de caractères
    let rootNameString = rootName;
    if (Array.isArray(rootName)) {
      rootNameString = rootName.join('');
    }

    // Ajouter le nom original du dossier parent au formulaire
    formData.append("originalFolderName", rootNameString);
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
      }, 50);

      const displayContent = () => {

      };
    }, [name]);


    return <summary style={{ marginLeft: ml }}> {summaryContent}</summary>;
  }

  let uniqueCount = 0;
  function generateUniqueId() {
    uniqueCount++;
    return Date.now().toString(36) + Math.random().toString(36).substr(2) + uniqueCount;
  }

  const generateTreeElement = (item, level = 0) => {
    const uniqueValue = generateUniqueId();
    const indentValue = level + '0px';
    if (item.type === "file") {
      return (
        <Group bg={item.text ? "inverted" : "red"} key={uniqueValue} ml={indentValue} px="sm" w="fit-content" mt="3px" mb="2px" style={{ borderRadius: "0.5rem", alignItems: "flex-start" }}>
          <Summary name={item.name} />
        </Group>
      );
    }

    return (
      <Accordion.Item key={uniqueValue} value={uniqueValue} ml={indentValue}>
        <Accordion.Control >
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

    //console.log(contentToDisplay2)
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
      rootOriginalName: project?.rootOriginalName || "",
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

                        <Group>
                          <Text>Nom du projet :</Text>
                          <TextInput
                            w="50%"
                            placeholder="Nom"
                            value={form.values.name}
                            onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
                            error={form.errors.name}
                          />
                        </Group>

                        <Group>

                          <Text>Répertoire du projet :</Text>
                          <FileInput
                            w="50%"
                            placeholder={form.values.rootOriginalName ? form.values.rootOriginalName : (selectedDirectory ? rootName : "Aucun répertoire choisi")}
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
                          {/* <Button variant="subtle" c="red" onClick={handleChooseClick}>
                            Supprimer
                          </Button> */}
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
