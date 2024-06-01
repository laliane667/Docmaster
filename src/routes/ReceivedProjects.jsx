import { useEffect, useState } from "react"
import { Stack, Anchor, Card, Group, Text, Title, rem, Divider, Button, Pagination, Center, Badge } from "@mantine/core"
import { IconSearch, IconArchive, IconCompass, IconCalendar, IconClock2, IconBriefcase } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { get } from "../tools/Request"
import { useUser } from "../Context"
import UserAvatar from "../components/UserAvatar"
import { formatBytes } from "../tools/Util";

export default function ReceivedProjects() {
  const user = useUser()
  const [activePage, setPage] = useState(0)
  const [offers, setOffers] = useState(0)
  const [reportsMap, setReportsMap] = useState({})
  // Search
  const [launchSearch, setLaunchSearch] = useState(true)
  const [searchKeyWord, setSearchKeyWord] = useState("")

  const handleConsult = async () => {

  };

  useEffect(() => {
    async function getReceivedProjects() {
      const OffersRes = await get(`/offer/search`, { companyId: user.id, page: activePage })
      console.log(OffersRes)
      if (OffersRes) {
        setOffers(OffersRes)
      }
      const res = await get(`/report/shared`, { companyId: user.id })
      console.log(res)
      if (res) {
        setReportsMap(res)
      }
    }
    if (launchSearch) {
      getReceivedProjects()
      setLaunchSearch(false)
    }
  }, [activePage, launchSearch, searchKeyWord])

  return (

    <Stack gap="lg" align="center">
      <Group gap="xs" wrap="nowarp">
        <IconBriefcase />
        <Title ta="center" order={2} fw={600}>
          Mes projets reçus
        </Title>
      </Group>
      {Object.entries(reportsMap).map(([offerId, reportArrays]) => {
        //const [report, offer] = reportAndOfferArray[0];
        const offer = offers.find(offer => offer._id === offerId);
        if (offer) {
          return (
            <>
              {reportArrays.map(([report, student, offer]) => (
                <Card key={offer._id} p={0} shadow="sm" radius="md" withBorder maw={500} w="100%">
                  <Title ta="center" mt="xs" mx="md" order={3} fw={600}>
                    {offer.title}
                  </Title>
                  <Divider my={4} p={2} />
                  <Stack mx="md" gap={4}>
                    <Group wrap="nowarp" justify="space-between">
                      <Group>
                        <UserAvatar userId={student._id} size={60} />
                        <Stack gap={6}>
                          <Group gap="xs" wrap="nowarp">
                            <Text fw={500} size="sm" truncate="end">
                              {student.firstName} {student.lastName}
                            </Text>
                          </Group>
                          <Group gap="xs" wrap="nowarp">
                            <Text fw={500} size="sm" truncate="end">
                              {student.email}
                            </Text>
                          </Group>
                        </Stack>
                      </Group>
                      <Button variant="default" fw={500} size="sm" truncate="end">
                        Voir le profil
                      </Button>
                    </Group>

                    <Divider my="sm" mx="lg" />

                    {/* <Text fw={600} size="md" >Étudiant : {student.firstName} {student.lastName}</Text>
                    <Text fw={600} size="md" >Contact : {student.email}</Text> */}
                    <Group style={{ gap: "0", display: "flex", flexDirection: "column", alignItems: "flex-start", flexWrap: "nowrap" }}>
                      <Text c="grey" fw={500} size="sm" truncate="end">
                        Fichier : {report.originalname}
                      </Text>
                      <Text c="grey" fw={500} size="sm" truncate="end">
                        Type : {report.mimetype}
                      </Text>
                    </Group >
                    <Button component={Link} to={`/reportdetails/${report._id}`} variant="outline" leftSection={<IconSearch />} my="md">
                      Détails du travail rendu
                    </Button>
                  </Stack>


                </Card >
              ))
              }
            </>
          );
        }
        /* const [report, offer] = reportAndOfferArray[0];
        return (
          <Card key={reportId} p={0} shadow="sm" radius="md" withBorder maw={500} w="100%">
            <Title ta="center" mt="xs" mx="md" order={3} fw={600}>
              {offer?.title}
            </Title>
            <Divider my={4} />
            {
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
                <Group position="center" mb="md" grow>
                  <Button component={Link} to={`/offerdetails/${offer._id}`} variant="outline" leftSection={<IconSearch />}>
                    Détails
                  </Button>
                  <Button color="green" component={Link} to={`/deposit/${offer._id}`} variant="outline" leftSection={<IconArchive />}>
                    Dépot
                  </Button>
                </Group>
              </Stack>
            }
          </Card>
        ) */
      })}
      <Center my="lg">
        <Pagination color="black" value={activePage} onChange={setPage} total={3} />
      </Center>

    </Stack >
  )
}
