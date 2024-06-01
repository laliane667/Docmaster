import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./css/index.css"

//globalThis.SERVER = "https://" + import.meta.env.VITE_BACKEND_HOST + "" + import.meta.env.VITE_BACKEND_PORT
globalThis.SERVER = import.meta.env.VITE_BACKEND_HOST

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
