import { useEffect, useState } from "react"
import { Card, Group, Stack, Text, Title, rem, Divider, Button, Pagination, Center, Badge } from "@mantine/core"

export default function MyGrades() {
  const [activePage, setPage] = useState(0)

  return (
    <Stack gap="lg" align="center">
      <Card shadow="sm" radius="lg" w="100%" maw={500}>
        <Title ta="center" mx="md" order={3} fw={600}>
          Mes notes
        </Title>
      </Card>
      <Center my="lg">
        <Pagination color="black" value={activePage} onChange={setPage} total={3} />
      </Center>
    </Stack>
  )
}
