import { useEffect, useState } from "react"
import { useMantineTheme, Stack, Group, Paper, Card, Image, Text, Title, rem, Divider, Button, List, Center, TextInput, Badge } from "@mantine/core"
import { IconSearch, IconCompass, IconAdjustmentsFilled, IconCalendar, IconStethoscope } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { get } from "../tools/Request"
import UserAvatar from "../components/UserAvatar"
import { useUser } from "../Context";


import logo_docmaster from "../assets/docmaster.png"
import logo_docmaster_light from "../assets/docmaster_inverted.png"
export default function Plans() {
  const theme = useMantineTheme();
  return (
    <Stack gap="lg" align="center">

      <Paper radius="md" p="xl" m="sm" withBorder w="100%" maw={800}>
        <Stack mb="md" mt="md" align="center">
          <Image style={{ width: rem(200) }} fit="contain" src={theme.black == "#000" ? logo_docmaster : logo_docmaster_light} />
          <Text mb="md" ta="center">L'utilisation de Docmaster se mesure au nombre de lignes de code à analyser.<br />
            Deux types de formule s'offrent à vous :</Text>
          <Group>
            <Card radius="md" p="xl" withBorder="white" w="48%">
              <Title ta="center" mx="md" order={3} grow fw={600}>
                Abonnement mensuel
              </Title>
              <Divider my="md" />
              <Text mb="md" fw={600}>
                Rechargez tous les mois votre stock de crédits.
              </Text>
              <Text mb="md">
                Adaptez votre plan en fonction de votre besoin :
                <List m="sm">
                  <List.Item>Basic</List.Item>
                  <List.Item>Avancé</List.Item>
                  <List.Item>Industriel</List.Item>
                </List>
              </Text>
              <Button>
                Voir les plans
              </Button>
            </Card>
            <Card radius="md" p="xl" withBorder="white" w="48%" >
              <Title ta="center" mx="md" grow order={3} fw={600}>
                Acheter une doc
              </Title>
              <Divider my="md" />
              <Text fw={600} mb="md">
                Description sur mesure, <br />Prix sur mesure.
              </Text>

              <Text mb="md">
                Idéal pour tester sur des projets de compléxité moyenne à basse.
              </Text>

              <Text mb="md">
                Chargez votre projet pour obtenir le prix de la documentation.
              </Text>
              <Button>
                Commencer
              </Button>
            </Card>
          </Group>
          <Button
            autoContrast
            onClick={() => { }}
            variant={"light"}
            color="secondary"
            //leftSection={<tab.icon />}
            radius="sm"
            p="sm"
            h="auto"
          >Comment savoir quelle offre est la plus adaptée ? </Button>
        </Stack>
      </Paper>

    </Stack>
  )
}
