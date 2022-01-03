import { withAuthenticationRequired } from "@auth0/auth0-react"

function Layout({ children }) {
  return (
    <>
      <p>nav</p>
      <main>{children}</main>
      <p>footer</p>
    </>
  )
}


