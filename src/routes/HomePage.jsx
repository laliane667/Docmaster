import { Image, Title, Paper, Button, Divider, Stack, rem } from "@mantine/core"
import { Link } from "react-router-dom"
import { CATCH_PHRASE } from "../tools/Constants.js"
import XPMElogo from "../assets/XPMElogo.png"

export default function HomePage() {
  // Home page of the website
  return (
    <Stack align="center">
      <Paper radius="md" p="xl" m="sm" withBorder w="100%" maw={400}>
        <Stack mb="md" mt="md" align="center">
          {/* <Image src={XPMElogo} style={{ width: rem(200) }} fit="contain" /> */}
          <Title order={6} fw={600} my="sm">
            {CATCH_PHRASE}
          </Title>
          <Button component={Link} to="/offers">
            Parcourir nos offres
          </Button>
          <Divider w="90%" label="Ou" labelPosition="center" />
          <Button component={Link} to="/register">
            Créer un compte
          </Button>
        </Stack>
      </Paper>
    </Stack>
  )
}
