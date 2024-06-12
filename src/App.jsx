import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "dayjs/locale/fr";
import "./css/index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";

import ContextProvider from "./ContextProvider";
import { MantineProvider, virtualColor, createTheme, Button, Text, Anchor, TextInput, PasswordInput, Radio, Paper, Divider, Badge } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { DatesProvider } from "@mantine/dates";
import { useUser } from "./Context";

import {
  localStorageColorSchemeManager
} from '@mantine/core';

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'my-app-color-scheme',
});

import AppShell from "./routes/AppShell"
import CreateEditOffer, { loaderCreateEditOffer } from "./routes/CreateEditOffer"
import Deposit from "./routes/Deposit"
import Error404 from "./routes/Error404"
import HomePage from "./routes/HomePage"
import Login from "./routes/Login"
import MyGrades from "./routes/MyGrades"
import MyOffers from "./routes/MyOffers"
import Explore from "./routes/Explore"
import Plans from "./routes/Plans"
import SubscriptionBundle from "./routes/SubscriptionBundle"
import OfferDetails, { loaderOfferDetails } from "./routes/OfferDetails"
import OngoingProjects from "./routes/OngoingProjects"
import Project from "./routes/Project"
import ProjectEditCreate, { loaderCreateEditProject } from "./routes/ProjectEditCreate"
import Projects from "./routes/Projects"
import Profil, { loaderProfil } from "./routes/Profil"
import ProfilPublic, { loaderProfilPublic } from "./routes/ProfilPublic"
import Parameters from "./routes/Parameters"
import ReceivedProjects from "./routes/ReceivedProjects"
import Register from "./routes/Register"
import ReportDetails from "./routes/ReportDetails"

const darkTheme = createTheme({
  colorScheme: 'dark',
  colors: {
    primary: [
      '#ABC7F8',
      '#ABC7F8',
      '#ABC7F8',
      '#ABC7F8',
      '#ABC7F8',
      '#ABC7F8',
      '#ABC7F8',
      '#ABC7F8',
      '#ABC7F8',
      '#ABC7F8',
    ],
    secondary: [
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
    ],
    transparant: [
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        color: 'primary',
        autoContrast: true
      },
      variants: {
        secondary: {
          color: 'secondary',
        },
      },
    },
    Badge: {
      defaultProps: {
        radius: 'md',
        color: 'primary',
        autoContrast: true
      },
      variants: {
        secondary: {
          color: 'secondary',
        },
      },
    },
    TextInput: TextInput.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Radio: Radio.extend({
      defaultProps: {
        radius: "lg",
        color: "#fff",
      },
    }),
    Divider: Divider.extend({
      defaultProps: {
        color: "#fff"
      },
    }),
    Text: Text.extend({
      defaultProps: {
        color: "#fff"
      },
    }),
    Anchor: Anchor.extend({
      defaultProps: {
        component: 'a',
        color: '#fff',
      },
    }),
    Paper: Paper.extend({
      styles: (theme) => ({
        root: {
          //borderColor: "#fff",
          backgroundColor: "#101010"
        },
      }),
    }),
  },
});
const lightTheme = createTheme({
  black: "161616",
  colorScheme: 'dark',
  colors: {
    primary: [
      '#324795',
      '#324795',
      '#324795',
      '#324795',
      '#324795',
      '#324795',
      '#324795',
      '#324795',
      '#324795',
      '#324795',
    ],
    secondary: [
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
      '#000000',
    ],
    transparant: [
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
      '#ffffff00',
    ],
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: "md",
        color: "blue",
        color: "#324795",
      },
    }),
    Badge: Button.extend({
      defaultProps: {
        radius: "md",
        color: "blue",
        color: "#324795",
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Radio: Radio.extend({
      defaultProps: {
        radius: "lg",
        color: "#000",
      },
    }),
    Divider: Divider.extend({
      defaultProps: {
        color: "#000"

      },
    }),
    /* Title: Text.extend({
      defaultProps: {
        fontFamily: "Ubuntu Sans, sans-serif",
        color: "#000"
      }, 
    }),*/
    Text: Text.extend({
      defaultProps: {
        color: "#000"
      },
    }),
    Anchor: Anchor.extend({
      defaultProps: {
        component: 'a',
        color: '#000',
      },
    }),
    Paper: Paper.extend({
      styles: (theme) => ({
        root: {
          //borderColor: "#000",
          //backgroundColor: "#fff"
          backgroundColor: "#fafafa"
        },
      }),
    }),
  },
});


function Routes({ onThemeChange }) {
  const user = useUser()
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppShell onThemeChange={onThemeChange} />,
      errorElement: <Error404 />,
      children: [
        {
          path: "/",
          element: <Explore />,
        },
        {
          path: "/home",
          element: <HomePage />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "explore",
          element: <Explore />,
        },
        {
          path: "plans",
          element: <Plans />,
        },
        {
          path: "subscriptionbundle",
          element: <SubscriptionBundle />,
        },
        {
          path: "offerdetails/:id",
          element: <OfferDetails />,
          loader: async ({ params }) => {
            return await loaderOfferDetails(params)
          },
        },
        {
          path: "profil",
          element: <ProfilPublic />,
          loader: async () => {
            return await loaderProfil(user)
          },
        },
        {
          path: "profil/edit",
          element: <Profil />,
          loader: async () => {
            return await loaderProfilPublic(user)
          },
        },
        {
          path: "createoffer",
          element: <CreateEditOffer />,
          loader: async () => {
            return await loaderCreateEditOffer()
          },
        },
        {
          path: "editoffer/:id",
          element: <CreateEditOffer />,
          loader: async ({ params }) => {
            return await loaderCreateEditOffer(params)
          },
        },
        {
          path: "myoffers",
          element: <MyOffers />,
        },
        {
          path: "deposit/:id",
          element: <Deposit />
        },
        {
          path: "reportdetails/:id",
          element: <ReportDetails />,
        },
        {
          path: "project/:id",
          element: <Project />,
        },
        {
          path: "projectcreate",
          element: <ProjectEditCreate />,
          loader: async () => {
            return await loaderCreateEditOffer()
          },
        },
        {
          path: "projectedit/:id",
          element: <ProjectEditCreate />,
          loader: async ({ params }) => {
            return await loaderCreateEditProject(params)
          },
        },
        {
          path: "projects",
          element: <Projects />,
        },
        {
          path: "ongoingprojects",
          element: <OngoingProjects />,
        },
        {
          path: "mygrades",
          element: <MyGrades />,
        },
        {
          path: "receivedprojects",
          element: <ReceivedProjects />,
        },
        {
          path: "parameters",
          element: <Parameters />,
        },
        {
          path: "profilpublic/:role/:id",
          element: <ProfilPublic />,
          loader: async ({ params }) => {
            return await loaderProfilPublic(params)
          },
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

function App() {
  const [colorScheme, setColorScheme] = useState(null);

  const activeTheme = localStorage.getItem('activeTheme');

  function updateCss(activeTheme) {
    if (activeTheme == "dark") {
      /* document.getElementsByTagName('html')[0].style.backgroundColor = "#161616";
      document.getElementsByTagName('header')[0].style.backgroundColor = "#161616";
      document.getElementsByTagName('main')[0].style.backgroundColor = "#222222";
      document.getElementsByTagName('footer')[0].style.backgroundColor = "#222222";
    } else {
      document.getElementsByTagName('html')[0].style.backgroundColor = "#e9e9e9";
      document.getElementsByTagName('header')[0].style.backgroundColor = "#e9e9e9";
      document.getElementsByTagName('main')[0].style.backgroundColor = "#fefefe";
      document.getElementsByTagName('footer')[0].style.backgroundColor = "#fefefe"; */
    }
  }
  useEffect(() => {
    if (activeTheme) {
      setColorScheme(activeTheme === 'dark' ? 'dark' : 'light');
      updateCss(activeTheme)
    }
  }, [activeTheme]);

  const handleTheme = (theme) => {
    setColorScheme(theme);
    localStorage.setItem('activeTheme', theme);
    updateCss(activeTheme)
  };


  return (
    <>
      <ContextProvider>
        <MantineProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme} forceColorScheme={colorScheme}>
          <DatesProvider settings={{ locale: "fr" }}>
            <Notifications position="top-right" />
            <Routes onThemeChange={handleTheme} />
          </DatesProvider>
        </MantineProvider>
      </ContextProvider>
    </>
  );
}

export default App;
