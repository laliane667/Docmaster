import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "dayjs/locale/fr";
import "./css/index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";

import ContextProvider from "./ContextProvider";
import { MantineProvider, createTheme, Button, TextInput, PasswordInput, Radio, Paper, Divider } from "@mantine/core";
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
import Offers from "./routes/Offers"
import OfferDetails, { loaderOfferDetails } from "./routes/OfferDetails"
import OngoingProjects from "./routes/OngoingProjects"
import PastProjects from "./routes/PastProjects"
import Profil, { loaderProfil } from "./routes/Profil"
import ProfilPublic, { loaderProfilPublic } from "./routes/ProfilPublic"
import Parameters from "./routes/Parameters"
import ReceivedProjects from "./routes/ReceivedProjects"
import Register from "./routes/Register"
import ReportDetails from "./routes/ReportDetails"

const darkTheme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: "md",
        color: "blue",
        //color: "#324795",
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
        color: "#fff",
      },
    }),
    Divider: Divider.extend({
      defaultProps: {
        color: "#fff"

      },
    }),
    Paper: Paper.extend({
      styles: (theme) => ({
        root: {
          borderColor: "#fff",
          backgroundColor: "#101010"
        },
      }),
    }),
  },
});
const lightTheme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: "md",
        color: "blue",
        //color: "#324795",
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

    Paper: Paper.extend({
      styles: (theme) => ({
        root: {
          borderColor: "#000",
          backgroundColor: "#fff"
          //backgroundColor: "#e0e0e0"
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
          path: "offers",
          element: <Offers />,
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
          path: "pastprojects",
          element: <PastProjects />,
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
      document.getElementsByTagName('html')[0].style.backgroundColor = "#161616";
      document.getElementsByTagName('header')[0].style.backgroundColor = "#161616";
      document.getElementsByTagName('main')[0].style.backgroundColor = "#222222";
      document.getElementsByTagName('footer')[0].style.backgroundColor = "#222222";
    } else {
      document.getElementsByTagName('html')[0].style.backgroundColor = "#e9e9e9";
      document.getElementsByTagName('header')[0].style.backgroundColor = "#e9e9e9";
      document.getElementsByTagName('main')[0].style.backgroundColor = "#fefefe";
      document.getElementsByTagName('footer')[0].style.backgroundColor = "#fefefe";
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
      {/* <ColorSchemeScript defaultColorScheme="auto" /> */}
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
