import { useEffect, useState } from "react"
import { useMantineTheme, Stack, Group, Paper, Card, Image, Text, Title, rem, Divider, Button, Pagination, Center, TextInput, Badge } from "@mantine/core"
import { IconSearch, IconCompass, IconAdjustmentsFilled, IconCalendar, IconClock2 } from "@tabler/icons-react"
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
          <Group>
            <Card radius="md" p="xl" withBorder="white">
              <Title ta="center" mx="md" order={3} fw={600}>
                Abonnement
              </Title>
            </Card>
            <Card radius="md" p="xl" withBorder="white">
              <Title ta="center" mx="md" order={3} fw={600}>
                Abonnement
              </Title>
            </Card>
          </Group>
        </Stack>
      </Paper>

    </Stack>
  )
}
