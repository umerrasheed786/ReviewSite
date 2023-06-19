import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./scss/style.scss";

import ProtectedRoute from "./views/pages/protected/ProtectedRoute";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Containers
// const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Layout = React.lazy(() => import("./layout/Layout"));
const CommentList = React.lazy(() =>
  import("./views/pages/comment/CommentList.js")
);
const Comment = React.lazy(() => import("./views/pages/comment/Comment.js"));
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard.js"));

// import Layout from "./layout/Layout"
// import Comment from "./views/pages/comment/Comment";
// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const App = () => {
  return (
    <Suspense fallback={loading}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route exact path="/login" name="Login Page" element={<Login />} />
        <Route
          exact
          path="/app"
          name="App"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            exact
            path="dashboard"
            name="Dashboard"
            element={<Dashboard />}
          />
          <Route
            exact
            path="comments"
            name="comment Page"
            element={<CommentList />}
          />
          <Route
            exact
            path="create-comments"
            name="comment Page"
            element={<Comment />}
          />
        </Route>
        {/* <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} /> */}
        <Route path="*" name="404" element={<Page404 />} />
      </Routes>
      <ToastContainer />
    </Suspense>
  );
};

export default App;
