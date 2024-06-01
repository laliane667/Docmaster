import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Group, Stack, Text, Title, rem, Divider, Button, Center, Badge } from "@mantine/core"

export default function PastProjects() {
  const [activePage, setPage] = useState(0)
  const navigate = useNavigate()

  const handlePageChange = (page) => {
    setPage(page)
    if (page === 0) {
      navigate("/ongoingprojects")
    } else {
      navigate("/pastprojects")
    }
  }
  return (
    <Stack gap="lg" align="center">
      
      <Group position="center" my="lg">
        <Button color="light-grey" variant="outline" onClick={() => handlePageChange(0)}>
          En cours
        </Button>
        <Button variant="outline" onClick={() => handlePageChange(1)}>
          Passées
        </Button>
      </Group>
      <Card shadow="sm" radius="lg" w="100%" maw={500}>
        <Title ta="center" mx="md" order={3} fw={600}>
          Mes projets passés
        </Title>
      </Card>
    </Stack>
  )
}
