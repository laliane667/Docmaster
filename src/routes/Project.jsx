import React from "react";
import { Paper, Card, Group, Stack, Text, Title, rem, Divider, Button, Center, Image, Badge } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconRadiusBottomLeft, IconChevronDown, IconEdit, IconCalendar, IconTrendingUp, IconVocabulary, IconListNumbers } from "@tabler/icons-react";

import gitHub from "../assets/typeImage/github.png"

const projectTypeImages = {
  cpp: '/src/assets/typeImage/cpp.png',
  c: '/src/assets/typeImage/c.png',
  js: '/src/assets/typeImage/js.png',
  java: '/src/assets/typeImage/java.png',
  // Ajoutez d'autres associations ici
};

export default function Project() {
  const projectType = "java"; // Remplacez par le type de projet réel

  // Vérifiez si l'association pour le type de projet existe
  const projectImage = projectTypeImages[projectType];

  return (
    <Stack gap="lg" align="center">
      <Title ta="center" mx="md" order={3} size="1.2rem" fw={600}>
        My project
      </Title>
      <Card p={0} shadow="sm" radius="md" withBorder maw={1000} w="100%">

        {/* <Divider my={4} /> */}
        <Group p="lg" mx="md" style={{ display: "flex", justifyContent: "space-between" }}>
          <Group m="0">
            <Stack gap={0}>

              <Group mb={0} style={{ display: "flex", alignItems: "base-line" }}>
                {projectImage && <Image h="xl" src={projectImage} alt="Project type" />} {/* Affichez l'image si elle existe */}
                <Title ta="left" m="0" order={3} fw={600}>
                  Mission Master
                </Title>
                <Badge px="5px" py="3px" variant="filled" radius="18px" miw="15px" h="17px" color="green">Nouveau</Badge>
              </Group>
              <Group ml="xs" mt={0}>
                {React.createElement(IconRadiusBottomLeft)}
                <Group mt="xs" p="0">
                  <Text >
                    Projet java
                  </Text>
                  <Badge>
                    doc publique
                  </Badge>
                </Group>

              </Group>
            </Stack>
            <Divider mx="lg" orientation="vertical" />

            <Stack gap="0" mx="0" maw={350} align="left">
              <Group gap="xs" wrap="nowarp">
                <IconCalendar style={{ width: rem(18), height: rem(18) }} />
                <Text fw={400} size="sm" truncate="end">
                  Dernière modification :
                </Text>
                <Text fw={600} size="sm" truncate="end">
                  20/05/2024
                </Text>
              </Group>
              <Group gap="xs" wrap="nowarp">
                <IconEdit style={{ width: rem(18), height: rem(18) }} />
                <Text fw={400} size="sm" truncate="end">
                  Modifié par :
                </Text>
                <Text fw={600} size="sm" truncate="end">
                  Théo Issenhuth
                </Text>
              </Group>
              <Group gap="xs" wrap="nowarp">
                <IconTrendingUp style={{ width: rem(18), height: rem(18) }} />
                <Text fw={400} size="sm" truncate="end">
                  Avancement du projet :
                </Text>
                <Text fw={600} size="sm" truncate="end">
                  55%
                </Text>
              </Group>
              <Group gap="xs" wrap="nowarp">
                <IconVocabulary style={{ width: rem(18), height: rem(18) }} />
                <Text fw={400} size="sm" truncate="end">
                  Mise à jour du doc :
                </Text>
                <Text fw={600} size="sm" truncate="end">
                  20/05/2024
                </Text>
              </Group>
              <Group gap="xs" wrap="nowarp">
                <IconListNumbers style={{ width: rem(18), height: rem(18) }} />
                <Text fw={400} size="sm" truncate="end">
                  Nombre de lignes :
                </Text>
                <Text fw={600} size="sm" truncate="end">
                  42 239
                </Text>
              </Group>
              <Button pl="0" ml="0" mt="xs" w="fit-content" color="secondary" variant="subtle" component={Link} to="/login" leftSection={<IconChevronDown />}>
                Voir plus
              </Button>
            </Stack>
          </Group>
          {/* <Group>
            <Card variant="secondary">
              <Image h="xl" src={gitHub} />

            </Card>
          </Group> */}
          <Group>
            <Button component={Link} to="/login">
              Gérer
            </Button>
            <Button variant="outline" component={Link} to="/login">
              Voir la doc
            </Button>

          </Group>

        </Group>
      </Card>
    </Stack >
  );
}
