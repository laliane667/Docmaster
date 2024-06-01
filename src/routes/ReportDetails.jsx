import React from "react";
import { useEffect, useState } from "react"
import { Card, Group, Stack, Text, Title, rem, Divider, Button, Textarea, Rating } from "@mantine/core"
import { IconStar, IconDownload, IconSend, IconCalendar } from "@tabler/icons-react"
import { useLoaderData, Link, useParams } from "react-router-dom"
import { NotifInfo, NotifSuccess } from "../components/Notification";
import { useUser } from "../Context"
import { get } from "../tools/Request"
import { post } from "../tools/Request"
import {
  IconZip,
  IconPdf,
  IconVideo,
  IconFileMusic,
  IconCode,
  IconPresentation,
  IconFolder
} from "@tabler/icons-react";

import UserAvatar from "../components/UserAvatar"
export async function loaderProfil(user) {
  if (!user.token) return redirect("/login")
  const profil = await get(`/${user.role}`, { token: user.token })
  return profil
}

export default function ReportDetails() {
  const { id } = useParams()
  const user = useUser()
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");


  function getFileExtension(mimetype) {
    const parts = mimetype.split("/");
    if (parts.length === 2) {
      return parts[1];
    }
    return "";
  }

  const fileIcons = {
    "zip": IconZip,
    "pdf": IconPdf,
    /*     "doc": IconDocument,
        "docx": IconDocument,
        "txt": IconDocument,
        "odt": IconDocument,
        "jpg": IconImage,
        "jpeg": IconImage,
        "png": IconImage,
        "gif": IconImage, */
    "mp4": IconVideo,
    "avi": IconVideo,
    "mkv": IconVideo,
    "mov": IconVideo,
    "wmv": IconVideo,
    "wav": IconFileMusic,
    "mp3": IconFileMusic,
    "ogg": IconFileMusic,
    "flac": IconFileMusic,
    "js": IconCode,
    "json": IconCode,
    "html": IconCode,
    "css": IconCode,
    "php": IconCode,
    "py": IconCode,
    "java": IconCode,
    /* "csv": IconSpreadsheet,
    "xls": IconSpreadsheet,
    "xlsx": IconSpreadsheet,
    "ods": IconSpreadsheet, */
    "ppt": IconPresentation,
    "pptx": IconPresentation,
    "odp": IconPresentation,
    "folder": IconFolder
  };


  /* const [activePage, setPage] = useState(0)
  const [reportsMap, setReportsMap] = useState({})
  // Search
  const [launchSearch, setLaunchSearch] = useState(true)
  const [searchKeyWord, setSearchKeyWord] = useState("") */

  const [report, setReport] = useState(0)
  const [student, setStudent] = useState(0)
  const [offer, setOffer] = useState(0)
  const [participationId, setParticipationId] = useState(0)
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    const gradeSaved = localStorage.getItem('gradeSaved');
    if (gradeSaved) {
      localStorage.removeItem('gradeSaved');
      NotifSuccess("Brouillon enregistré", "Votre brouillon a correctement été sauvegardé.");
    }
    const gradeShared = localStorage.getItem('gradeShared');
    if (gradeShared) {
      localStorage.removeItem('gradeShared');
      NotifSuccess("Note envoyée", "Votre note a correctement été envoyée à l'étudiant. Vous pouvez maintenant consulter un autre projet reçu.");
    }
    async function getReceivedProjects() {
      const res = await get(`/report/shared`, { companyId: user.id, reportId: id })
      //console.log(res)
      if (res) {
        //setReportsMap(res.data); // Stockez la réponse dans reportsMap
        const offerId = Object.keys(res)[0]; // Récupère la première clé de l'objet reportsMap
        //console.log("OfferId" + offerId)
        if (offerId && res[offerId].length > 0) {
          const [report, student, offer] = res[offerId][0]; // Récupère les données du premier tableau dans reportsMap[offerId]
          setReport(report);
          setStudent(student);
          setOffer(offer);
          const resx = await get(`/participation/offstud`, { offerId: offer._id, studentId: student._id })
          if (resx) {
            console.log(resx[0]._id);
            setParticipationId(resx[0]._id)
            ///console.log(resx._id);
            const gradeRes = await get(`/grade/`, { token: user.token, participationId: resx[0]._id });
            if (gradeRes) {
              setGrade(gradeRes);
              setRating(gradeRes.grade);
              setComment(gradeRes.comment);
            }
          }

        }
      }
    }
    if (!report || !student || !offer || !participationId) {
      getReceivedProjects()
    }
  }, [id, user.id, user.token, report, student, offer, participationId, grade])


  const saveDraft = async () => {
    const data = {
      token: user.token,
      ownerId: user.id,
      studentId: student._id,
      participationId: participationId,
      grade: rating,
      comment: comment,
      shared: false
    };

    try {
      console.log("token: " + user.token);
      console.log("id: " + user.id);
      console.log("student: " + student._id);
      console.log("Note: " + data.note);
      console.log("Comment: " + data.comment);
      const response = await post("/grade/", data);
      localStorage.setItem('gradeSaved', true); // Stocke un état temporaire dans localStorage
      window.location.assign(window.location.pathname); // Recharge la page actuelle
      if (response) {
      }
      console.log(response);
    } catch (error) {
      console.warn(error);
      // Gérer l'erreur si nécessaire
    }
  };

  const handleShare = async () => {

    const formData = new FormData();
    if (grade._id) {
      formData.append("id", grade._id);
      const response = await post("/grade/share", { id: grade._id })
    }
    localStorage.setItem('gradeShared', true); // Stocke un état temporaire dans localStorage
    window.location.assign(window.location.pathname); // Recharge la page actuelle
  };

  if (report && student && offer) {

    const downloadFile = async () => {
      let fileUrl = import.meta.env.VITE_BACKEND_HOST + "/" + report.filepath;

      //const fileType = report.mimetype;

      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = report.originalname;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    return (
      <Stack gap="lg" align="center">
        <Card key={offer._id} p={0} shadow="sm" radius="md" withBorder maw={500} w="100%">
          <Title ta="center" mt="xs" mx="md" order={3} fw={600}>
            {offer.title}
          </Title>
          <Divider my={4} p={2} />
          <Stack mx="md" gap={4}>
            <Group justify="space-between">
              <Group wrap="nowrap">
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
            <Group style={{ margin: "0 auto" }}>
              {fileIcons[getFileExtension(report.mimetype)] && React.createElement(fileIcons[getFileExtension(report.mimetype)])}
              <Text c="dark" fw={800} size="xl" truncate="end">
                Fichier : {report.originalname}
              </Text>
            </Group>
            <Group style={{ margin: "0 0 15px 0", gap: "0", display: "flex", flexDirection: "column", alignItems: "center", flexWrap: "nowrap" }}>
              {/* <Text c="grey" fw={500} size="sm" truncate="end">
                Date de rendu : 11/05/2024 (Hier)
              </Text>
              <Text c="grey" fw={500} size="sm" truncate="end">
                Temps passé : 42h
              </Text> */}
              <Text c="grey" fw={500} size="sm" truncate="end">
                Type : {report.mimetype}
              </Text>
            </Group >
            <Button variant="outline" leftSection={<IconDownload />} my="md" onClick={downloadFile}>
              Télécharger le fichier
            </Button>

            <Stack gap="0" align="center" style={{ margin: "0", padding: "0", display: 'flex', alignItems: "center" }}>
              <Text style={{ marginTop: "15px" }} fw={500} size="md" >Note : {rating}</Text>
              <Rating
                mt="5px"
                size="xl"
                fractions={4}
                value={rating}
                onChange={(value) => setRating(value)}
              />
              <Text style={{ margin: "25px 0 10px 0" }} fw={500} size="md" >Recommandation :</Text>
              <Textarea w="100%"
                placeholder="Description"
                value={comment}
                onChange={(event) => setComment(event.currentTarget.value)}
                autosize
                minRows={3}
              />
            </Stack>


            <Group style={{ margin: '15px 0 0 0' }} position="center" grow>
              <Button variant="outline" my="md" onClick={saveDraft}>
                Enregistrer le brouillon
              </Button>
              <Button color={"green"} variant="outline" leftSection={<IconSend />} my="md" onClick={handleShare}>
                Envoyer
              </Button>
            </Group>
          </Stack>
        </Card >
      </Stack>
    )

  }
}
