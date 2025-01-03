import { useEffect, useState } from "react"

interface Toast {
  id: string
  title: string
  description?: string
  type?: "default" | "success" | "error" | "warning"
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (newToast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((currentToasts) => [...currentToasts, { ...newToast, id }])
  }

  const dismiss = (id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((currentToasts) => currentToasts.slice(1))
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return { toast, dismiss, toasts }
} 