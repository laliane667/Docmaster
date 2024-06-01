import { useEffect, useState } from "react"
import { Card, Group, Stack, Text, Title, rem, Divider, Button, Pagination, Center, Badge } from "@mantine/core"
import { IconSearch, IconCompass, IconCalendar, IconClock2 } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { get } from "../tools/Request"
import UserAvatar from "../components/UserAvatar"
import { useUser } from "../Context"

export default function MyOffers() {
  const user = useUser()
  const [offers, setOffers] = useState([])
  const [activePage, setPage] = useState(0)
  const [launchSearch, setLaunchSearch] = useState(true)

  useEffect(() => {
    async function getOffers() {
      const res = await get(`/offer/search`, { companyId: user.id, page: activePage })
      console.log(res)
      if (res) {
        setOffers(res)
      }
    }
    if (launchSearch) {
      getOffers()
      setLaunchSearch(false)
    }
  }, [activePage, launchSearch, user.id])

  return (
    <Stack gap="lg" align="center">
      <Title ta="center" mx="md" order={2} fw={600}>
        Mes offres
      </Title>
      {offers.map((offer) => {
        return (
          <Card key={offer._id} p={0} shadow="sm" radius="md" withBorder maw={500} w="100%">
            <Title ta="center" mt="xs" mx="md" order={3} fw={600}>
              {offer.title}
            </Title>
            <Divider my={4} p={2} />
            <Stack mx="md" gap={4}>
              <Text fw={500}>{offer.company}</Text>
              <Group wrap="nowarp">
                <UserAvatar userId={offer.owner} size={60} />
                <Stack gap={6}>
                  <Group gap="xs" wrap="nowarp">
                    <Group gap={0}>
                      <IconCompass style={{ width: rem(18), height: rem(18) }} />
                    </Group>
                    <Group gap={4}>
                      {offer.sector.split(",").map((elem) => (
                        <Badge key={elem + offer.title} variant="dot" color="black">
                          {elem}
                        </Badge>
                      ))}
                    </Group>
                  </Group>
                  <Group gap="xs" wrap="nowarp">
                    <IconCalendar style={{ width: rem(18), height: rem(18) }} />
                    <Text fw={500} size="sm" truncate="end">
                      {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                    </Text>
                  </Group>
                  <Group gap="xs" wrap="nowarp">
                    <IconClock2 style={{ width: rem(18), height: rem(18) }} />
                    <Text fw={500} size="sm" truncate="end">
                      {offer.workingHours}h
                    </Text>
                  </Group>
                </Stack>
              </Group>

              <Divider my="sm" mx="lg" />
              <Text lineClamp={3}>{offer.description}</Text>
              <Button component={Link} to={`/offerdetails/${offer._id}`} variant="outline" leftSection={<IconSearch />} my="md">
                Détails de l&apos;offre
              </Button>
            </Stack>
          </Card>
        )
      })}
      <Center my="lg">
        <Pagination color="black" value={activePage} onChange={setPage} total={3} />
      </Center>
    </Stack>
  )
}
