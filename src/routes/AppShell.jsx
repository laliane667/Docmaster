import "../css/AppShell.module.css"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Group, Drawer, Burger, Stack, Avatar, Divider, Image, Center, Text, Tooltip, Anchor, rem, useMantineTheme } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useUser, useSetUser } from "../Context"
import Logout from "../tools/Logout"
import { Outlet } from "react-router-dom"
import {
  IconHome,
  IconBriefcase,
  IconStar,
  IconSquarePlus,
  IconSettings,
  IconListDetails,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconList,
  IconBrandX,
  IconVocabulary,
} from "@tabler/icons-react"
import { CATCH_PHRASE } from "../tools/Constants"

import logo_docmaster from "../assets/docmaster.png"
import logo_docmaster_light from "../assets/docmaster_inverted.png"
import Parameters from "./Parameters"

export default function AppShell({ onThemeChange }) {
  const theme = useMantineTheme();
  const [ColorScheme, setColorScheme] = useState("dark")
  //console.log(theme.black)
  const user = useUser()
  const setUser = useSetUser()
  const navigate = useNavigate()
  const [opened, { close, toggle }] = useDisclosure(false)
  const [activeTab, setActiveTab] = useState("/")

  const tabs = [
    //{ link: "/", label: "Page d'acceuil", icon: IconHome },
    { link: "projectcreate", label: "Créer un projet", icon: IconSquarePlus, highlight: true },
    { link: "projects", label: "Mes projets", icon: IconList },
    { link: "offers", label: "Mes documentations", icon: IconVocabulary },
    { link: "parameters", label: "Paramètres", icon: IconSettings },
    { link: "explore", label: "Explore", icon: IconList },
    { link: "plans", label: "Plans", icon: IconList },
  ]
  const companyTabs = [
    //{ link: "/", label: "Page d'acceuil", icon: IconHome },
    { link: "createoffer", label: "Poster une offre", icon: IconSquarePlus, highlight: true },
    { link: "myoffers", label: "Mes offres", icon: IconListDetails },
    { link: "receivedprojects", label: "Projets reçus", icon: IconBriefcase },
    //{ link: "companies", label: "Entreprises", icon: IconBuilding },
  ]

  const handleThemeChange = (theme) => {
    onThemeChange(theme);
    //console.log(theme)
    setColorScheme(theme)
  };

  return (
    <>
      <Drawer size={250} opened={opened} onClose={close} withCloseButton={false}>
        <Stack gap={0}>
          <Center mb="xl" mt="md">
            <Link to="/">
              <Image h={50} w="auto" fit="contain" src={theme.black == "#000" ? logo_docmaster : logo_docmaster_light} />
            </Link>
          </Center>
          <Group grow>
            <Button onClick={() => handleThemeChange('light')}>Light</Button>
            <Button onClick={() => handleThemeChange('dark')}>Dark</Button>
          </Group>
          <Divider my="sm" mx="xl" />
          {user.token ? (
            <Stack gap={0} ml="xs">
              <Avatar src={user.photo} variant="filled" radius="sm" size={55} color="black" mb="xs" />
              <Text size="sm" fw={500}>
                {user.fullName === null || user.fullName === "null" ? "Mon compte" : user.fullName}
              </Text>
              <Text truncate="end" w={180} c="dimmed" size="xs" fw={400}>
                {user.email}
              </Text>
              <Button component={Link} to="profil" onClick={close} w="fit-content" variant="light" mt="xs">
                Mon profil
              </Button>
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
            <>
              <Button component={Link} to="register" onClick={close}>
                Inscription
              </Button>
              <Divider my="sm" mx="xl" />
              <Button component={Link} to="login" onClick={close}>
                Connexion
              </Button>
            </>
          )}

          <Divider size="sm" my="lg" color="dark" />
          {user.token ? (
            <>
              {user.role !== "company" && (
                <>
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
                        variant={activeTab === tab.link ? "light" : "subtle"}
                        color="secondary"
                        leftSection={<tab.icon />}
                        radius="sm"
                        p="sm"
                        h="auto"
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </Stack>
                  <Divider size="sm" my="lg" color="dark" />
                </>
              )}

              {user.role === "company" && (
                <>
                  <Stack gap={2}>
                    {companyTabs.map((tab) => (
                      <Button
                        justify="flex-start"
                        key={tab.link}
                        onClick={() => {
                          navigate(tab.link);
                          setActiveTab(tab.link);
                          close();
                        }}
                        variant={tab.highlight ? "filled" : activeTab === tab.link ? "light" : "subtle"}
                        leftSection={<tab.icon />}
                        radius="sm"
                        p="sm"
                        h="auto"
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </Stack>
                  <Divider size="sm" my="lg" color="dark" />
                </>
              )}
            </>
          ) : null}

          {/* <Button fullWidth color="grey" size="compact-sm" component={Link} to="parameters" onClick={close} variant="light" mt="xs">
            Paramètres
          </Button> */}
          {user.token && (
            <Button fullWidth color="red" size="compact-sm" onClick={() => Logout(setUser, navigate)} variant="light" mt="xs">
              Déconnexion
            </Button>
          )}
        </Stack>
      </Drawer>

      <header>
        <Group justify="space-between" mx="lg" my={8}>
          <Link to="/">
            <Image h={35} w="auto" fit="contain" src={theme.black == "#000" ? logo_docmaster : logo_docmaster_light} />          </Link>

          <Burger opened={opened} color="secondary" onClick={toggle} aria-label="Toggle navigation" />
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
    </>
  )
}
