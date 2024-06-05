import { useEffect, useState } from "react"
import { useMantineTheme, Stack, Group, Paper, Card, Image, Text, Title, rem, Divider, Button, List, Center, TextInput, Badge } from "@mantine/core"
import { IconSearch, IconCompass, IconAdjustmentsFilled, IconCalendar, IconStethoscope } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { get } from "../tools/Request"
import UserAvatar from "../components/UserAvatar"
import { useUser } from "../Context";
import { useMediaQuery } from "react-responsive";

import logo_docmaster from "../assets/docmaster.png"
import logo_docmaster_light from "../assets/docmaster_inverted.png"
export default function SubscriptionBundle() {
  const theme = useMantineTheme();
  const isLargeScreen = useMediaQuery(
    { minDeviceWidth: 1224 }
  )

  return (
    <Stack gap="lg" align="center">

      <Paper radius="md" p="xl" m="sm" withBorder w="100%" maw={1150}>
        <Stack mb="md" mt="md" align="center">
          <Image style={{ width: rem(200) }} fit="contain" src={theme.black == "#000" ? logo_docmaster : logo_docmaster_light} />
          <Text mb="md" ta="center">L'utilisation de Docmaster se mesure au nombre de lignes de code à analyser.<br />
            Deux types de formule s'offrent à vous :</Text>
          {isLargeScreen ? (
            <Group p="xl" w="100%" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
              <Card w="32%" radius="md" p="xl" withBorder>
                <Title ta="center" mx="md" order={3} fw={600}>
                  Basique
                </Title>
                <Text ta="center" size="lg" fw={600}>
                  4€/mois
                </Text>
                <Divider my="md" />
                <Text mb="md" ta="center" size="lg" fw={600}>
                  Nombre de lignes : 10 000
                </Text>
                <Button>
                  Voir les plans
                </Button>
              </Card>
              <Card w="32%" radius="md" p="xl" style={{ border: "1px solid silver" }}>
                <Title ta="center" mx="md" order={3} fw={600}>
                  Avancé
                </Title>
                <Text ta="center" size="lg" fw={600}>
                  14€/mois
                </Text>
                <Divider my="md" />
                <Text mb="md" ta="center" size="lg" fw={600}>
                  Nombre de lignes : 100 000
                </Text>
                <Button>
                  Voir les plans
                </Button>
              </Card>
              <Card w="32%" radius="md" p="xl" style={{ border: "1px solid gold" }}>
                <Title ta="center" mx="md" order={3} fw={600}>
                  Industriel
                </Title>
                <Text ta="center" size="lg" fw={600}>
                  94€/mois
                </Text>
                <Divider my="md" />
                <Text mb="md" ta="center" size="lg" fw={600}>
                  Nombre de lignes : 1M
                </Text>
                <Button>
                  Voir les plans
                </Button>
              </Card>

            </Group>

          ) : (
            <Group style={{ display: "flex", flexWrap: "wrap" }}>

              <Card w="100%" radius="md" p="xl" withBorder="white">
                <Title ta="center" mx="md" order={3} fw={600}>
                  Basique
                </Title>
                <Text ta="center" size="lg" fw={600}>
                  4€/mois
                </Text>
                <Divider my="md" />
                <Text mb="md" ta="center" size="lg" fw={600}>
                  Nombre de lignes : 10 000
                </Text>
                <Button>
                  Voir les plans
                </Button>
              </Card>
              <Card w="100%" radius="md" p="xl" withBorder="white">
                <Title ta="center" mx="md" order={3} fw={600}>
                  Avancé
                </Title>
                <Text ta="center" size="lg" fw={600}>
                  14€/mois
                </Text>
                <Divider my="md" />
                <Text mb="md" ta="center" size="lg" fw={600}>
                  Nombre de lignes : 100 000
                </Text>
                <Button>
                  Voir les plans
                </Button>
              </Card>
              <Card w="100%" radius="md" p="xl" withBorder="white">
                <Title ta="center" mx="md" order={3} fw={600}>
                  Industriel
                </Title>
                <Text ta="center" size="lg" fw={600}>
                  94€/mois
                </Text>
                <Divider my="md" />
                <Text mb="md" ta="center" size="lg" fw={600}>
                  Nombre de lignes : 1M
                </Text>
                <Button>
                  Voir les plans
                </Button>
              </Card>
            </Group>

          )}

          <Button
            autoContrast
            onClick={() => { }}
            variant={"light"}
            color="secondary"
            //leftSection={<tab.icon />}
            radius="sm"
            p="sm"
            h="auto"
            mt="lg"
          >Comment savoir quelle offre est la plus adaptée ? </Button>
        </Stack>
      </Paper>

    </Stack>
  )
}