import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Group, Stack, Text, Title, rem, Divider, Button, Center, Badge } from "@mantine/core"
import { Link } from "react-router-dom"
import { get } from "../tools/Request"
import { IconSearch, IconArchive, IconCompass, IconCalendar, IconClock2 } from "@tabler/icons-react"
import { useUser } from "../Context"
import { hasUserSubmitReport } from "./OfferDetails"

import UserAvatar from "../components/UserAvatar"

export default function OngoingProjects() {
  const navigate = useNavigate()
  const user = useUser()
  const [offers, setOffers] = useState([])
  const [activePage, setPage] = useState(0)
  const [launchSearch, setLaunchSearch] = useState(true)

  // Search
  const [searchKeyWord, setSearchKeyWord] = useState("")

  const [reportSubmissions, setReportSubmissions] = useState([])

  const handlePageChange = (page) => {
    setPage(page)
    if (page === 0) {
      navigate("/ongoingprojects")
    } else {
      navigate("/pastprojects")
    }
  }

  useEffect(() => {
    async function getOffers() {
      const res = await get(`/participation/user`, { id: user.id })
      console.log(res)
      if (res) {
        setOffers(res)
      }
    }
    if (launchSearch) {
      getOffers()
      setLaunchSearch(false)
    }
  }, [activePage, launchSearch, searchKeyWord])

  useEffect(() => {
    async function fetchReportSubmissions() {
      const submissions = await Promise.all(offers.map(async (offer) => {
        const hasSubmitted = await hasUserSubmitReport(offer.owner, user.id, offer._id); // Appeler hasUserSubmitReport pour chaque offre
        return { offerId: offer._id, hasSubmitted };
      }));
      setReportSubmissions(submissions);
    }
    fetchReportSubmissions();
  }, [offers, user])

  return (
    <Stack gap="lg" align="center">
      <Group position="center" my="lg">
        <Button variant="outline" onClick={() => handlePageChange(0)}>
          En cours
        </Button>
        <Button color="light-grey" variant="outline" onClick={() => handlePageChange(1)}>
          Passées
        </Button>
      </Group>
      <Card shadow="sm" radius="lg" w="100%" maw={500}>
        <Title ta="center" mx="md" order={3} fw={600}>
          Mes projets en cours
        </Title>
      </Card>
      {offers && offers.map((offer) => {
        const report = reportSubmissions.find((r) => r.offerId === offer._id); // Trouver le rapport de soumission pour cette offre
        console.log("Report:" + report);
        const hasSubmitted = report ? report.hasSubmitted : false; // Utiliser la valeur de hasSubmitted dans le rapport, ou false par défaut

        return (
          <Card key={offer._id} p={0} shadow="sm" radius="md" withBorder maw={500} w="100%">
            <Title ta="center" mt="xs" mx="md" order={3} fw={600}>
              {offer.title}
            </Title>
            <Divider my={4} />
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
              <Group position="center" mb="md" grow>
                <Button component={Link} to={`/offerdetails/${offer._id}`} variant="outline" leftSection={<IconSearch />}>
                  Détails
                </Button>
                {/* <Button color="green" component={Link} to={`/deposit/${offer._id}`} variant="outline" leftSection={<IconArchive />}>
                  Dépot
                </Button> */}
                <Button color={hasSubmitted ? "green" : "black"} component={Link} to={`/deposit/${offer._id}`} variant="outline" leftSection={<IconArchive />}>
                  Dépot
                </Button>
              </Group>
            </Stack>
          </Card>
        )
      })}
    </Stack>
  )
}