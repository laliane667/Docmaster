import { useMantineTheme, Image, Title, Paper, Button, Divider, Stack, rem } from "@mantine/core"
import { Link } from "react-router-dom"
import { CATCH_PHRASE } from "../tools/Constants.js"

import logo_docmaster from "../assets/docmaster.png"
import logo_docmaster_light from "../assets/docmaster_inverted.png"
export default function HomePage() {
  const theme = useMantineTheme();

  // Home page of the website
  return (
    <Stack align="center">
      <Paper radius="md" p="xl" m="sm" withBorder w="100%" maw={400}>
        <Stack mb="md" mt="md" align="center">
          <Image style={{ width: rem(200) }} fit="contain" src={theme.black == "#000" ? logo_docmaster : logo_docmaster_light} />

          <Title order={6} fw={600} my="sm">
            {CATCH_PHRASE}
          </Title>
          <Button component={Link} to="/register">
            Créer un compte
          </Button>
          <Divider w="90%" label="Ou" labelPosition="center" />
          <Button component={Link} to="/login">
            Se connecter
          </Button>
        </Stack>
      </Paper>
    </Stack>
  )
}
