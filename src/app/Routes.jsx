import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import React, { Suspense, lazy } from "react"
import Navigation from "./Navigation.tsx"
import Loader from "./Loader.tsx"
import Error from "./Error.tsx"
import { ErrorProvider } from "./contexts/ErrorContext.tsx"
import { NavigationProvider } from "./contexts/NavigationContext.tsx"
import { PostsProvider } from "./contexts/PostsContext.tsx"
import { UserProvider } from "./contexts/UserContext.tsx"
import "./main.css"

// const Browse = lazy(() => import("./Browse.tsx" /* webpackChunkName: "Browse" */));
const Login = lazy(() =>
  import("./User/Login.tsx" /* webpackChunkName: "Login" */)
)
const Message = lazy(() =>
  import("./Messages/Message.tsx" /* webpackChunkName: "Message" */)
)
const Notifications = lazy(() =>
  import("./User/Notifications.tsx" /* webpackChunkName: "Notifications" */)
)
const Messages = lazy(() =>
  import("./Messages/Messages.tsx" /* webpackChunkName: "Messages" */)
)
const Posts = lazy(() => import("./Posts.tsx" /* webpackChunkName: "Posts" */))
const Profile = lazy(() =>
  import("./User/Profile.tsx" /* webpackChunkName: "Profile" */)
)
const Submit = lazy(() =>
  import("./Post/Submit.tsx" /* webpackChunkName: "Submit" */)
)

export default function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <ErrorProvider>
          <NavigationProvider>
            <UserProvider>
              <PostsProvider>
                <Switch>
                  <Route
                    path="/add"
                    render={({ history }) => <Submit history={history} />}
                  />
                  <Route path="/login" render={() => <Login />} />
                  <Route
                    path="/message/:name"
                    render={({ match }) => <Message params={match.params} />}
                  />
                  <Route path="/messages" render={() => <Messages />} />
                  <Route
                    path={["/profile", "/profile/edit", "/user/:name"]}
                    render={({ match }) => <Profile params={match.params} />}
                  />
                  {/* <Route
                    path="/browse"
                    render={() => <Browse />}
                  /> */}
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
              </PostsProvider>
            </UserProvider>
          </NavigationProvider>
        </ErrorProvider>
      </Suspense>
    </Router>
  )
}
