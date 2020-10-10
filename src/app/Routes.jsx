import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import React, { Suspense, lazy } from "react"
import Navigation from "./Navigation.tsx"
import Loader from "./Loader.tsx"
import Error from "./Error.tsx"
import { ErrorProvider } from "./contexts/ErrorContext.tsx"
import { PostsProvider } from "./contexts/PostsContext.tsx"
import { RatingsProvider } from "./contexts/RatingsContext.tsx"
import { UserProvider } from "./contexts/UserContext.tsx"
import "./main.css"

const Login = lazy(() =>
  import("./User/Login.tsx" /* webpackChunkName: "Login" */)
)
const Messages = lazy(() =>
  import("./Messages/Messages.tsx" /* webpackChunkName: "Messages" */)
)
const Notifications = lazy(() =>
  import("./User/Notifications.tsx" /* webpackChunkName: "Notifications" */)
)
const Conversations = lazy(() =>
  import("./Messages/Conversations.tsx" /* webpackChunkName: "Conversations" */)
)
const Posts = lazy(() => import("./Posts.tsx" /* webpackChunkName: "Posts" */))
const Profile = lazy(() =>
  import("./User/Profile.tsx" /* webpackChunkName: "Profile" */)
)
const EditProfile = lazy(() =>
  import("./User/EditProfile.tsx" /* webpackChunkName: "EditProfile" */)
)
const Submit = lazy(() =>
  import("./Post/Submit.tsx" /* webpackChunkName: "Submit" */)
)

export default function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <ErrorProvider>
          <UserProvider>
            <PostsProvider>
              <RatingsProvider>
                <Switch>
                  <Route
                    path="/add"
                    render={({ history }) => <Submit history={history} />}
                  />
                  <Route path="/login" render={() => <Login />} />
                  <Route
                    path="/message/:conversationPartner"
                    render={({ match }) => <Messages params={match.params} />}
                  />
                  <Route path="/messages" render={() => <Conversations />} />
                  <Route
                    path={"/profile/edit"}
                    render={() => <EditProfile />}
                  />
                  <Route
                    path={["/profile", "/user/:name"]}
                    render={({ match }) => <Profile params={match.params} />}
                  />
                  <Route
                    path="/tag/:tag"
                    render={({ history, location, match }) => (
                      <Posts
                        fullUrl={location.pathname}
                        history={history}
                        url={match.url}
                        tag={match.params.tag}
                      />
                    )}
                  />
                  <Route
                    path="/posts/:user"
                    render={({ history, location, match }) => (
                      <Posts
                        fullUrl={location.pathname}
                        history={history}
                        url={match.url}
                        userName={match.params.user}
                      />
                    )}
                  />
                  <Route
                    path="/notifications"
                    render={({ history }) => (
                      <Notifications history={history} />
                    )}
                  />
                  <Route
                    path="/"
                    render={({ history, location, match }) => (
                      <Posts
                        fullUrl={location.pathname}
                        history={history}
                        url={match.url}
                      />
                    )}
                  />
                </Switch>
                <Navigation />
                <Error />
              </RatingsProvider>
            </PostsProvider>
          </UserProvider>
        </ErrorProvider>
      </Suspense>
    </Router>
  )
}
