import { useEffect, useState } from "react"
import { Card, Group, Stack, Text, Title, rem, Divider, Button, Badge } from "@mantine/core"
import { IconBuildingFactory2, IconArchive, IconCompass, IconCalendar, IconClock2, IconCalendarDue } from "@tabler/icons-react"
import { useLoaderData, Link } from "react-router-dom"
import { useUser } from "../Context"
import { get } from "../tools/Request"
import { post } from "../tools/Request"

import UserAvatar from "../components/UserAvatar"

export async function loaderOfferDetails(params) {
  let offer = null
  let company = null
  if (params && params.id) {
    offer = await get(`/offer`, { id: params.id })
    company = await get(`/company`, { id: offer.owner })
  }
  return { offer, company, offerId: params.id }
}

export async function hasUserSubmitReport(companyId, userId, offerId) {
  const res = await get(`/report/shared`, { companyId: companyId, userId: userId })
  if (res) {
    const resOfferId = Object.keys(res)[0]; // Récupère la première clé de l'objet reportsMap
    console.log("OfferId" + offerId)
    if (resOfferId && res[resOfferId].length > 0) {
      const [report, student, offer] = res[offerId][0]; // Récupère les données du premier tableau dans reportsMap[offerId]
      console.log(report.shared)
      return report.shared;
    }
  }
  return false;
  //console.log(offers)
  //return offers.some(offer => offer._id.toString() === offerId.toString())
}

export default function OfferDetails() {
  const { offer, company, offerId } = useLoaderData()
  const user = useUser()

  const [hasApplied, setHasApplied] = useState(false)
  const [hasSubmitReport, setHasSubmitReport] = useState(false)

  useEffect(() => {
    if (user.token && user.role === "student") {
      hasUserApplied(offerId, user.id).then(setHasApplied)
      hasUserSubmitReport(company._id, user.id, offerId).then(setHasSubmitReport)
    }
  }, [user, offerId])

  async function hasUserApplied(offerId, userId) {
    const offers = await get(`/participation/user`, { id: userId })
    //console.log(offers)
    let ret = offers.some(offer => offer._id.toString() === offerId.toString())
    console.log(ret)
    return ret
  }



  async function handleSubmit() {
    //console.log("offre : " + offerId + " / student : " + user.id)
    await post("/participation", { offerId: offerId, owner: user.id })
    window.location.reload();

    NotifSuccess(
      "Merci !",
      "Votre demande a été envoyée."
    )
    //nextRenderNavigate("/profil")
  }

  return (
    <Stack gap="lg" align="center">
      <Card key={offer.id} p={0} shadow="sm" radius="md" withBorder maw={500} w="100%">
        {offer === null && <Text>Offre introuvable</Text>}
        {offer && (
          <>
            <Title ta="center" mt="xs" mx="md" order={3} fw={600}>
              {offer.title}
            </Title>
            <Divider my={4} />
            <Stack mx="md" gap={4} mb="md">
              <Stack gap={6}>
                <Group gap="xs" wrap="nowarp" justify="space-between">
                  <Group gap={4}>
                    <IconBuildingFactory2 style={{ width: rem(18), height: rem(18) }} />
                    <Text fw={500} size="sm" wrap="nowarp">
                      Entreprise&nbsp;:
                    </Text>
                    <Text size="sm" truncate="end">
                      {company.name}
                    </Text>
                  </Group>
                  <UserAvatar userId={offer.owner} size={40} my={4} />
                </Group>
                <Group gap={4} wrap="nowarp">
                  <Group gap={4} wrap="nowarp">
                    <IconCompass style={{ width: rem(18), height: rem(18) }} />
                    <Text fw={500} size="sm">
                      Secteur&nbsp;:
                    </Text>
                  </Group>
                  <Group gap={4}>
                    {offer.sector.split(",").map((elem) => (
                      <Badge size="sm" key={elem + offer.title} variant="dot" color="black">
                        {elem}
                      </Badge>
                    ))}
                  </Group>
                </Group>
                <Group gap={4} wrap="nowarp">
                  <IconCalendar style={{ width: rem(18), height: rem(18) }} />
                  <Text fw={500} size="sm">
                    Date&nbsp;de&nbsp;début&nbsp;:
                  </Text>
                  <Text size="sm" truncate="end">
                    {new Date(offer.startDate).toLocaleDateString()}
                  </Text>
                </Group>
                <Group gap={4} wrap="nowarp">
                  <IconCalendarDue style={{ width: rem(18), height: rem(18) }} />
                  <Text fw={500} size="sm">
                    Date&nbsp;de&nbsp;fin&nbsp;:
                  </Text>
                  <Text size="sm" truncate="end">
                    {new Date(offer.endDate).toLocaleDateString()}
                  </Text>
                </Group>
                <Group gap={4} wrap="nowarp">
                  <IconClock2 style={{ width: rem(18), height: rem(18) }} />
                  <Text fw={500} size="sm">
                    Temps&nbsp;de&nbsp;travail&nbsp;:
                  </Text>
                  <Text size="sm" truncate="end">
                    {offer.workingHours}h
                  </Text>
                </Group>
              </Stack>

              <Divider mt="sm" mx="lg" />
              <Text fw={500} fz={14}>
                Description de l&apos;offre :
              </Text>
              <Text fz={14}>{offer.description}</Text>
              <Divider my="sm" mx="lg" />
              {user.token && user.role === "student" && (
                <>
                  {hasApplied ? (
                    <Button color={hasSubmitReport ? "green" : "black"} component={Link} to={`/deposit/${offer._id}`} variant="outline" leftSection={<IconArchive />}>
                      Dépot
                    </Button>
                  ) : (
                    <Button variant="filled" color="teal" onClick={handleSubmit}>
                      Postuler
                    </Button>
                  )}
                </>
              )}

              {user.token && user.role === "company" && user.id === offer.owner && (
                <Button component={Link} to={`/editoffer/${offerId}`}>
                  Modifier mon offre
                </Button>
              )}
              {!user.token && (
                <Button component={Link} to="/register">
                  M&apos;inscire pour postuler
                </Button>
              )}
            </Stack>
          </>
        )}
      </Card>
    </Stack>
  )
}
