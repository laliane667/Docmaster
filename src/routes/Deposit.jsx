import { Group, Text, Divider, Paper, Title, Button, Textarea, TextInput, Stack, MultiSelect, NumberInput, Modal, FileInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { IconCheck, IconFileUpload, IconFileCheck, IconFileX, IconMailbox, IconDownload, IconArchive, IconSend, IconSendOff } from "@tabler/icons-react"
import { useUser } from "../Context";
import { put, get, post, del } from "../tools/Request";
import { useLoaderData, useParams } from "react-router-dom";
import { NotifInfo, NotifSuccess } from "../components/Notification";
import useNextRenderNavigate from "../tools/useNextRenderNavigate";
import { useState, useEffect } from "react";
import { fileUpload } from "../tools/Request";
import { formatBytes } from "../tools/Util";
import "../css/Components.css"

export default function Deposit() {
  const { id } = useParams();
  const user = useUser();
  const [participation, setParticipation] = useState(null);
  let [report, setReport] = useState(null);
  const [filePath, setFilePath] = useState(null);

  //const [participationId, setParticipationId] = useState(null);
  let [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const nextRenderNavigate = useNextRenderNavigate();
  useEffect(() => {
    const fileAdded = localStorage.getItem('fileAdded');
    if (fileAdded) {
      localStorage.removeItem('fileAdded');
      NotifSuccess("Fichier ajouté", "Votre fichier a correctement été enregistré.");
    }

    const fileDeleted = localStorage.getItem('fileDeleted');
    if (fileDeleted) {
      localStorage.removeItem('fileDeleted'); // Supprime l'état temporaire après utilisation
      NotifSuccess("Fichier supprimé", "Votre fichier a correctement été supprimé.");
    }

    const fileShared = localStorage.getItem('fileShared');
    if (fileShared) {
      localStorage.removeItem('fileShared');
      NotifSuccess("Fichier envoyé", "Votre fichier a correctement été envoyé à l'entreprise.");
    }
    const fetchData = async () => {
      if (id && user) {
        const responseReport = await get(`/report/lastone`, {
          offerId: id,
          studentId: user.id,
        });
        const response = await get(`/participation/offstud`, {
          offerId: id,
          studentId: user.id,
        });
        if (response && response[0]) {
          setParticipation(response[0]);
        }
        //console.log(responseReport);
        if (responseReport) {
          const report = responseReport;
          const filePath = responseReport.filepath;
          const originalname = responseReport.originalname;
          const mimetype = responseReport.mimetype;
          if (filePath != "" && originalname != "" && mimetype != "") {
            setReport(report);
            setFilePath(filePath)
            const fileContent = await fetchFile(filePath, originalname, mimetype);
            setSelectedFile(fileContent);
          }
          //setParticipationId(response[0]._id);


          //setFileName(response[0].file.name);
        }
      }
    };

    fetchData();

  }, [id, user]);

  const form = useForm({
    initialValues: {
      file: selectedFile || null,
    },
  });


  const fetchFile = async (filePath, srcName, mimetype) => {
    const response = await fetch(filePath);
    const text = await response.text();
    const blob = new Blob([text], { type: mimetype });
    const fileName = srcName;//filePath.split('/').pop();
    const file = new File([blob], fileName, { type: mimetype });
    return file;
  };





  const handleFileChange = (file) => {
    console.log(file.name);
    setFilePath(null);
    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleSave = async () => {
    await handleSubmit();
  };

  const handleSubmit = async () => {

    const formData = new FormData();
    formData.append("id", participation._id);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    if (participation._id) {
      const response = await fileUpload("/report/upload", {}, formData);
    }
    localStorage.setItem('fileAdded', true); // Stocke un état temporaire dans localStorage
    window.location.assign(window.location.pathname); // Recharge la page actuelle
  };

  const handleShare = async () => {

    const formData = new FormData();
    formData.append("id", report._id);

    if (report._id) {
      console.log(report._id)
      const response = await post("/report/share", { id: report._id })
    }
    localStorage.setItem('fileShared', true); // Stocke un état temporaire dans localStorage
    window.location.assign(window.location.pathname); // Recharge la page actuelle
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      selectedFile = null;
      if (report != null) {
        await del(`/report`, { id: report._id });
        localStorage.setItem('fileDeleted', true); // Stocke un état temporaire dans localStorage
      }
      window.location.assign(window.location.pathname); // Recharge la page actuelle
    }
  };






  if (participation) {

    const downloadFile = async () => {
      //let fileUrl = "https://xpme.eu/api/" + filePath;
      let fileUrl = import.meta.env.VITE_BACKEND_HOST + "/" + filePath;

      const fileType = selectedFile.type;
      console.log("URL:" + fileUrl)
      console.log("Type:" + fileType)
      console.log("Name:" + selectedFile.name)

      const fileName = "test.wav";

      // Créer un Blob à partir de l'URL du fichier
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Créer un objet URL à partir du Blob
      const url = URL.createObjectURL(blob);

      // Créer un élément a pour le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name;

      // Ajouter l'élément a au corps du document
      document.body.appendChild(link);

      // Cliquer sur l'élément a pour déclencher le téléchargement
      link.click();

      // Supprimer l'élément a du corps du document
      document.body.removeChild(link);

      // Libérer l'objet URL
      URL.revokeObjectURL(url);
    };


    return (
      <Stack align="center">
        <Paper radius="md" p="xl" m="sm" withBorder w="100%" maw={400}>
          <form>
            <Group style={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "nowrap" }}>
              <FileInput className={selectedFile ? "file-selected" : "file-not-selected"}
                label={selectedFile ? (filePath ? (
                  <Group><IconArchive color="green" /><Text>Fichié enregistré</Text></Group>
                ) : (
                  <Group><IconCheck color="green" /><Text>Fichié chargé</Text></Group>
                )) : (
                  <Group><IconFileUpload color="grey" /><Text>Charger un fichier</Text></Group>
                )}
                placeholder="Aucun fichier choisi"
                name="file"
                value={selectedFile || undefined}
                onChange={handleFileChange}
                rightSection={selectedFile && <IconFileCheck color="grey" />}
                error={null}
                disabled={!selectedFile ? false : report ? (report.shared ? true : false) : false}
              />
              {selectedFile && (
                <Button color="lightgrey" variant="outline" style={{ marginTop: '40px', width: 'auto', padding: '8px', minWidth: 'auto' }} onClick={downloadFile}>
                  <IconDownload color="grey" style={{ height: '20px', minWidth: "10px" }} />
                </Button>
              )}
            </Group>

            {selectedFile && (
              <Group style={{ padding: "20px 0 5px 0", gap: "0", display: "flex", flexDirection: "column", alignItems: "flex-start", flexWrap: "nowrap" }}>
                <Text color="grey">Taille : {formatBytes(selectedFile.size)}</Text>
                <Text color="grey">Type : {selectedFile.type}</Text>
              </Group>
            )}

            {selectedFile && (
              <Divider my="sm" mx="lg" />

            )}
            {report && report.shared == true && (
              <Text>L'entreprise n'as pas encore consulté votre travail.</Text>
            )}


            {/* {filePath && (
              <Group>
                <IconCheck color="green" />
                <Text>Fichié enregistré</Text>
              </Group>
            )} */}
            {selectedFile && (
              <Group style={{ margin: '15px 0 0 0' }} position="center" grow>
                {report && report.shared == true ? (
                  <Button color="red" onClick={handleDelete} variant="outline" leftSection={<IconSendOff />}>
                    Annuler l'envoi
                  </Button>
                ) : (
                  <>
                    <Button color="red" onClick={handleDelete} variant="outline" leftSection={<IconFileX />}>
                      Supprimer
                    </Button>

                    {!filePath && (
                      <Button color="green" onClick={handleSave} variant="outline" leftSection={<IconMailbox />}>
                        Enregistrer
                      </Button>
                    )}
                  </>

                )}

              </Group>
            )}

            {filePath && report.shared == false && (
              <Group style={{ margin: '15px 0 0 0' }} position="center" grow>
                <Button color="green" onClick={handleShare} variant="outline" leftSection={<IconSend />}>
                  Envoyer à l'entreprise
                </Button>
              </Group>
            )}
          </form>
        </Paper>
      </Stack >
    );
  }
}