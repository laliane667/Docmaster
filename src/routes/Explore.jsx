import { useEffect, useRef, useState } from "react"
import { useMantineTheme, Stack, Group, Paper, Card, Image, Text, Title, rem, Divider, Button, Pagination, Center, TextInput, Badge } from "@mantine/core"
import { IconSearch, IconCompass, IconAdjustmentsFilled, IconCalendar, IconClock2 } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { get } from "../tools/Request"
import UserAvatar from "../components/UserAvatar"
import { useUser } from "../Context";

import logo_docmaster from "../assets/docmaster.png"
import logo_docmaster_light from "../assets/docmaster_inverted.png"

let scroller;

function loadLocomotiveScroll() {
  return new Promise((resolve) => {
    if (window.LocomotiveScroll) {
      resolve();
    } else {
      const script = document.createElement('script');
      script.src = '/locomotive-scroll.min.js';
      script.onload = () => {
        resolve();
      };
      document.head.appendChild(script);
    }
  });
}

export default function Explore() {
  const theme = useMantineTheme();
  const imageRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    loadLocomotiveScroll().then(() => {
      scroller = new LocomotiveScroll({
        el: containerRef.current,
        smooth: true,
        multiplier: 0.5
      });

      scroller.on('scroll', () => {
        if (containerRef.current) {
          setIsLoaded(true);
        }
      });

      // Nettoyer l'effet
      return () => {
        scroller.destroy();
      }
    });
  }, []);

  const handleImageLoad = () => {
    if (containerRef.current) {
      scroller.update();
    }
  }

  return (
    <Stack gap="lg" align="center" ref={containerRef} data-scroll-container h={1200} w="100%">
      {isLoaded && (
        <>
          <Group data-scroll w="100%" h="70%" maw={1200}
            style={{ position: "absolute", padding: "0", margin: "0", gap: "0", display: "flex", flexDirection: "column", alignItems: "center", flexWrap: "nowrap", justifyContent: "center" }}
          >
            <Image data-scroll /* data-scroll-position="top" */ data-scroll-speed={0} ref={imageRef} onLoad={handleImageLoad} style={{ position: "absolute", zIndex: "10", margin: "0", width: "40%" }} maw={800} src={theme.black == "#000" ? logo_docmaster : logo_docmaster_light} />
            <Paper data-scroll data-scroll-speed={1} style={{ position: "absolute", zIndex: "0", margin: "0" }} radius="md" p="xl" m="sm" withBorder w="60%" h="20vw"></Paper>
            <Text mt="14%" style={{ zIndex: "10", fontSize: "0.8srem" }} >V0.1</Text>
          </Group>
        </>

      )}

      <Paper radius="md" w="100vw" h={400} style={{ position: "absolute", bottom: "0%", display: "flex", flexDirection: "column", alignItems: "center" }} mx={0} data-scroll scroll-offset={100} data-scroll-speed={4}>
        <Text size="2rem" my="xl" fw={200}>
          Qu'est-ce que Docmaster ?
        </Text>
        <Text
          ta="center"
          p="xl"
        >
          Docmaster est une application innovante de documentation générée par IA, conçue pour faciliter la création de documents pour des projets dans divers langages de programmation. Grâce à Docmaster, obtenez des documentations complètes, claires et précises de manière rapide et efficace, que ce soit par abonnement mensuel ou via un service à la demande. Simplifiez votre processus de documentation et concentrez-vous sur ce qui compte vraiment : le développement de votre projet.
        </Text>
      </Paper>
    </Stack >
  )
}
