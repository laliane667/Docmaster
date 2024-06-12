import "../css/AppShell.module.css"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Modal, Button, Group, Drawer, Burger, Stack, Avatar, Divider, Image, Center, Box, Flex, Text, Tooltip, Anchor, rem, TextInput, useMantineTheme } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useUser, useSetUser } from "../Context"
import Logout from "../tools/Logout"
import { Outlet } from "react-router-dom"
import {
  IconHome,
  IconBriefcase,
  IconServer2,
  IconSquarePlus,
  IconSettings,
  IconListDetails,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconList,
  IconBrandX,
  IconVocabulary,
  IconLogout,
  IconSun,
  IconMoon
} from "@tabler/icons-react"

import { useForm } from "@mantine/form"
import { put, get, post, del } from "../tools/Request"

import { CATCH_PHRASE } from "../tools/Constants"
import { useMediaQuery } from "react-responsive";

import logo_docmaster from "../assets/docmaster.png"
import logo_docmaster_light from "../assets/docmaster_inverted.png"
import Parameters from "./Parameters"

export default function AppShell({ onThemeChange }) {
  const theme = useMantineTheme();
  const isLargeScreen = useMediaQuery(
    { minDeviceWidth: 1224 }
  )
  const [ColorScheme, setColorScheme] = useState("dark")
  //console.log(theme.black)
  const user = useUser()
  const setUser = useSetUser()
  const navigate = useNavigate()
  const [opened, { close, toggle }] = useDisclosure(false)
  const [modalOpened, setModalOpened] = useState(false);

  const [activeTab, setActiveTab] = useState("/")

  const tabs = [
    //{ link: "/", label: "Page d'acceuil", icon: IconHome },
    { link: "projectcreate", label: "Nouveau", icon: IconSquarePlus, variant: "outline" },
    { link: "projects", label: "Mes projets", icon: IconList },
    //{ link: "parameters", label: "Paramètres", icon: IconSettings },
    //{ link: "explore", label: "Explore", icon: IconList },
    //{ link: "plans", label: "Plans", icon: IconList },
  ]
  const doctabs = [
    { link: "servers", label: "Mes servers", icon: IconServer2 },
    { link: "offers", label: "Mes documentations", icon: IconVocabulary },
  ]

  const form = useForm({
    validate: {
      name: (value) => (value.length > 50 ? "Votre titre ne peut pas faire plus de 50 caractères." : null),
      description: (value) => (value.length > 200 ? "Votre description ne peut pas faire plus de 200 caractères." : null),
      localPath: (value) => (value.length > 200 ? "Votre titre ne peut pas faire plus de 50 caractères." : null),
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

  const toggleColorScheme = () => {
    if (theme.black == "#000") {
      handleThemeChange('light')
    } else {
      handleThemeChange('dark')
    }
  };
  const handleThemeChange = (theme) => {
    onThemeChange(theme);
    //console.log(theme)
    setColorScheme(theme)
  };

  const handleLogout = async () => {
    close()
    Logout(setUser, navigate)
  }
  return (
    <>
      <Drawer size={300} opened={opened} onClose={close} withCloseButton={false}>
        <Stack gap={0}>
          <Center mb="xl" mt="md">
            <Link to="/">
              <Image h={50} w="auto" fit="contain" src={theme.black == "#000" ? logo_docmaster : logo_docmaster_light} />
            </Link>
          </Center>
          {/* <Group grow>
            <Button onClick={() => handleThemeChange('light')}>Light</Button>
            <Button onClick={() => handleThemeChange('dark')}>Dark</Button>
          </Group>
          <Divider my="sm" mx="xl" /> */}
          {user.token ? (
            <Stack gap={0} ml="xs" mb="xl">
              <Group style={{ display: "flex", flexWrap: "nowrap" }}>
                <Avatar src={user.photo} variant="filled" radius="sm" size={55} color="black" mb="xs" />

                <Stack gap={0}>
                  <Text size="sm" fw={500}>
                    {user.fullName === null || user.fullName === "null" ? "Mon compte" : user.fullName}
                  </Text>
                  <Text truncate="end" w={180} c="dimmed" size="xs" fw={400}>
                    {user.email}
                  </Text>

                </Stack>
              </Group>
              <Group grow>

                <Button component={Link} to="profil" onClick={close} w="fit-content" mt="xs">
                  Mon profil
                </Button>
                <Button component={Link} to="profil" onClick={close} w="fit-content" variant="outline" mt="xs">
                  Équipes
                </Button>
              </Group>
              {/* {user.role === "company" ? (
                <>
                  <Button component={Link} to="myoffers" onClick={close} color="black" w="fit-content" variant="light" mt="xs">
                    Mes offres
                  </Button>
                  <Button component={Link} to="createoffer" onClick={close} color="teal" w="fit-content" variant="light" mt="xs">
                    Créer une offre
                  </Button>
                </>
              ) : (
                <></>
              )} */}
            </Stack>
          ) : (
            <Stack gap="lg">
              <Button component={Link} to="login" onClick={close} variant="filled">
                Voir les offres
              </Button>
              <Button component={Link} to="login" onClick={close} variant="outline">
                Se connecter
              </Button>
              <Button component={Link} to="register" onClick={close} variant="filled">
                Inscription
              </Button>
              <Divider my="sm" mx="xl" />
            </Stack>
          )}

          {/* <Divider size="sm" my="lg" color="dark" /> */}
          {user.token ? (
            <>
              {user.role !== "company" && (
                <>
                  {doctabs.map((tab) => (
                    <Button
                      autoContrast
                      justify="flex-start"
                      key={tab.link}
                      onClick={() => {
                        navigate(tab.link);
                        setActiveTab(tab.link);
                        close();
                      }}
                      variant={tab.link == "projectcreate" ? ("outline") : (activeTab === tab.link ? ("light") : ("subtle"))}
                      color="secondary"
                      leftSection={<tab.icon />}
                      radius="sm"
                      p="sm"
                      h="auto"
                    >
                      {tab.label}
                    </Button>
                  ))}
                  <Divider size="sm" my="lg" color="dark" />

                  <Stack gap={2}>
                    {tabs.map((tab) => (
                      <Button
                        autoContrast
                        justify="flex-start"
                        key={tab.link}
                        onClick={() => {
                          navigate(tab.link);
                          setActiveTab(tab.link);
                          close();
                        }}
                        variant={tab.link == "projectcreate" ? ("outline") : (activeTab === tab.link ? ("light") : ("subtle"))}
                        color="secondary"
                        leftSection={<tab.icon />}
                        radius="sm"
                        p="sm"
                        h="auto"
                        mb="sm"
                      >
                        {tab.label}
                      </Button>
                    ))}
                    <Divider size="sm" my="lg" color="dark" />

                  </Stack>

                </>
              )}
            </>
          ) : null}
          {user.token && (
            <>
              <Button leftSection={<IconSettings />} fullWidth size="compact-sm" component={Link} to="parameters" onClick={close} variant="light" mt="xs">
                Paramètres
              </Button>
              <Button leftSection={<IconLogout />} fullWidth color="red" size="compact-sm" onClick={() => handleLogout()} variant="light" mt="xs">
                Déconnexion
              </Button>
            </>
          )}
        </Stack>
      </Drawer>

      <header>
        <Group justify="space-between" mx="lg" my={8}>
          <Group>

            <Link to="/">
              <Image h={35} w="auto" fit="contain" src={theme.black == "#000" ? logo_docmaster : logo_docmaster_light} />          </Link>

          </Group>
          <Group>

            {!user.token ? (
              <>
                {isLargeScreen && (
                  <Group>
                    <Button component={Link} to="plans" onClick={close} variant="subtle">
                      Voir les plans
                    </Button>
                    <Button component={Link} to="login" onClick={close} variant="outline">
                      Se connecter
                    </Button>
                    <Button component={Link} to="register" onClick={close} variant="filled">
                      Inscription
                    </Button>
                    <Button size="sm" px="10px" onClick={toggleColorScheme}>
                      {theme.black == "#000" ? <IconSun /> : <IconMoon />}
                    </Button>
                  </Group>
                )}
              </>
            ) : (
              <Group>
                <Button onClick={() => setModalOpened(true)} color="secondary" leftSection={<IconSquarePlus />} variant="transparent" >
                  Nouveau
                </Button>
                {isLargeScreen && (

                  <Button size="sm" px="10px" onClick={toggleColorScheme}>
                    {theme.black == "#000" ? <IconSun /> : <IconMoon />}
                  </Button>
                )}

              </Group>
            )}


            {(user.token || !isLargeScreen) && (
              <Burger opened={opened} color="secondary" onClick={toggle} aria-label="Toggle navigation" />
            )}
          </Group>
        </Group>
      </header>

      <main style={{ paddingLeft: rem(16), paddingRight: rem(16) }}>
        <Outlet />
      </main>

      <footer>
        <Stack m="6%" mb="lg">
          <Group position="left" component={Link} to="/" gap="lg" wrap="nowrap">
            <Image h={50} w="auto" fit="contain" src={theme.black == "#000" ? logo_docmaster : logo_docmaster_light} />
            <Text fz={16}>
              {CATCH_PHRASE}
            </Text>
          </Group>
          <Divider mt="sm" />
          <Group gap="xs" justify="center">
            <Anchor component={Link} to="/register" type="button" size="sm">
              Inscription
            </Anchor>
            <Divider orientation="vertical" my={4} />
            <Anchor component={Link} to="/login" type="button" size="sm">
              Connexion
            </Anchor>
            <Divider orientation="vertical" my={4} />
            <Anchor component={Link} to="/offers" type="button" size="sm">
              Offres
            </Anchor>
            <Divider orientation="vertical" my={4} />
            <Anchor component={Link} to="/companies" type="button" c="dimmed" size="sm">
              Entreprises
            </Anchor>
          </Group>

          <Stack align="center" mt="sm">
            <Text ta="center" size="sm">
              Docmaster v0.1
            </Text>
            <Text ta="center" size="sm">
              Retrouvez-nous sur les réseaux sociaux :
            </Text>
            <Group justify="center" w="100%">
              <Tooltip
                label="Bientôt"
                color="gray.9"
                transitionProps={{ transition: "pop", duration: 300 }}
                events={{ hover: true, focus: true, touch: true }}>
                <Button
                  variant="filled"
                  pr={6}
                  pl={6}
                  w={32}
                  h={32}
                  style={{
                    background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)",
                    border: 0,
                  }}>
                  <IconBrandInstagram />
                </Button>
              </Tooltip>
              <Tooltip
                label="Bientôt"
                color="gray.9"
                transitionProps={{ transition: "pop", duration: 300 }}
                events={{ hover: true, focus: true, touch: true }}>
                <Button variant="filled" pr={6} pl={6} w={32} h={32} style={{ backgroundColor: "rgb(10 102 194)", border: 0 }}>
                  <IconBrandLinkedin />
                </Button>
              </Tooltip>

              <Tooltip
                label="Bientôt"
                color="gray.9"
                transitionProps={{ transition: "pop", duration: 300 }}
                events={{ hover: true, focus: true, touch: true }}>
                <Button variant="filled" pr={6} pl={6} w={32} h={32} style={{ backgroundColor: "rgb(0 0 0)", border: 0 }}>
                  <IconBrandX />
                </Button>
              </Tooltip>
            </Group>
          </Stack>
        </Stack>
      </footer>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Créer un nouveau projet"
        centred="true"
      >
        <form onSubmit={form.onSubmit(() => handleSubmit())}>

          <TextInput
            mt="md"
            label="Nom"
            placeholder="Nom"
            value={form.values.name}
            onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
            error={form.errors.name}
          />
          <TextInput
            mt="sm"
            label="Description"
            placeholder="Description"
            value={form.values.description}
            onChange={(event) => form.setFieldValue("description", event.currentTarget.value)}
            error={form.errors.description}
          />
          <Flex align="flex-end">
            <Box flex="1" mr="sm">
              <TextInput
                mt="sm"
                label="Chemin d'accès"
                placeholder="Chemin d'accès"
                value={form.values.localPath}
                onChange={(event) => form.setFormikState({ localPath: event.currentTarget.value })}
                error={form.errors.localPath}
              />
            </Box>
            <Button>
              Choisir
            </Button>
          </Flex>

          <Group mt="lg" display="flex" justify="center">
            <Button type="submit">Créer</Button>
          </Group>


        </form>
      </Modal >

    </>
  )
}
