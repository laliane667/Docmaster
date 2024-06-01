import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function useNextRenderNavigate() {
  const navigate = useNavigate()
  const [path, setPath] = useState(null)

  useEffect(() => {
    if (path) {
      navigate(path)
    }
  }, [path, navigate])

  return setPath
}