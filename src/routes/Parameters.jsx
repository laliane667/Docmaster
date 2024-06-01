import { useEffect, useState } from "react"
import { Card, Group, Stack, Text, Title, rem, Divider, Button, Pagination, Center, Badge } from "@mantine/core"

export default function Parameters() {
  const [activePage, setPage] = useState(0)

  return (
    <Stack gap="lg" align="center">
      <Card shadow="sm" radius="lg" w="100%" maw={500}>
        <Title ta="center" mx="md" order={3} fw={600}>
          Mes paramètres
        </Title>
      </Card>
    </Stack>
  )
}
