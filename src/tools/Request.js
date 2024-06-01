import { NotifError } from "../components/Notification"

export async function get(url, params, serverURL = globalThis.SERVER) {
  const res = await (
    await fetch(serverURL + url + "?" + new URLSearchParams(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json()
  if (res.error) {
    NotifError("Erreur", res.error)
    return null
  }
  return res.data
}

export async function post(url, params, serverURL = globalThis.SERVER) {
  const res = await (
    await fetch(serverURL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
  ).json()
  if (res.error) {
    NotifError("Erreur", res.error)
    return null
  }
  return res.data
}

export async function put(url, params, serverURL = globalThis.SERVER) {
  const res = await (
    await fetch(serverURL + url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
  ).json()
  if (res.error) {
    NotifError("Erreur", res.error)
    return null
  }
  return res.data
}

export async function del(url, params, serverURL = globalThis.SERVER) {
  const res = await (
    await fetch(serverURL + url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
  ).json()
  if (res.error) {
    NotifError("Erreur", res.error)
    return null
  }
  return res.data
}

export async function fileUpload(url, params, formData, serverURL = globalThis.SERVER) {
  formData.append("type", params.type)
  formData.append("secret", params.secret)

  console.log("fileUpload called with:");
  console.log("URL:", url);
  console.log("Params:", params);
  console.log("Form data:", ...formData);
  const res = await (
    await fetch(serverURL + url, {
      method: "POST",
      body: formData,
    })
  ).json()
  if (res.error) {
    NotifError("Erreur", res.error)
    return null
  }
  return res.data
}