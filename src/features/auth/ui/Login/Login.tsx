import { useLoginMutation } from "@/features/auth/api/authApi.ts"
import { Path } from "@/common/routing"

export const Login = () => {
  const [login] = useLoginMutation()

  const loginHandler = () => {
    const redirectUri = import.meta.env.VITE_DOMAIN_ADDRESS + Path.OAuthRedirect

    const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${redirectUri}`

    window.open(url, "oauthPopup", "width=500 height=600")

    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) return

      const { code } = event.data
      if (!code) return

      login({ code, redirectUri, rememberMe: false })
      window.removeEventListener("message", receiveMessage)
    }

    window.addEventListener("message", receiveMessage)
  }

  return (
    <button type="button" onClick={loginHandler}>
      Login
    </button>
  )
}
