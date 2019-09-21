import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Navigation from "./Navigation.jsx";
import Loader from "./Loader.jsx";
import Error from "./Error.jsx";
import { ErrorProvider } from "./contexts/ErrorContext.jsx";
import { NavigationProvider } from "./contexts/NavigationContext.jsx";
import { PostsProvider } from "./contexts/PostsContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import "./main.css";

const Browse = lazy(() => import("./Browse.jsx" /* webpackChunkName: "Browse" */));
const Login = lazy(() =>
  import("./User/Login.jsx" /* webpackChunkName: "Login" */)
);
const Message = lazy(() =>
  import("./Messages/Message.jsx" /* webpackChunkName: "Message" */)
);
const Notifications = lazy(() =>
  import("./User/Notifications.jsx" /* webpackChunkName: "Notifications" */)
);
const Messages = lazy(() =>
  import("./Messages/Messages.jsx" /* webpackChunkName: "Messages" */)
);
const Posts = lazy(() => import("./Posts.jsx" /* webpackChunkName: "Posts" */));
const Profile = lazy(() =>
  import("./User/Profile.jsx" /* webpackChunkName: "Profile" */)
);
const Submit = lazy(() =>
  import("./Post/Submit.jsx" /* webpackChunkName: "Submit" */)
);

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
                    path="/profile"
                    render={({ match }) => <Profile params={match.params} />}
                  />
                  <Route
                    path="/user/:name"
                    render={({ match }) => <Profile params={match.params} />}
                  />
                  <Route
                    path="/browse"
                    render={() => <Browse />}
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
              </PostsProvider>
            </UserProvider>
          </NavigationProvider>
        </ErrorProvider>
      </Suspense>
    </Router>
  );
}
