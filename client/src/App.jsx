import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Projects from "./pages/admin/Projects";
import AssignTask from "./pages/admin/AssignTask";
import TeamMembers from "./pages/admin/TeamMembers";
import AddMember from "./pages/admin/AddMember";
import Settings from "./pages/admin/Settings";
import UserDashboard from "./pages/member/UserDashboard";
import MyTasks from "./pages/member/MyTasks";
import UserSettings from "./pages/member/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute role="admin">
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assign"
          element={
            <ProtectedRoute role="admin">
              <AssignTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <ProtectedRoute role="admin">
              <TeamMembers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addmember"
          element={
            <ProtectedRoute role="admin">
              <AddMember />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute role="admin">
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute role="member">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/tasks"
          element={
            <ProtectedRoute role="member">
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/settings"
          element={
            <ProtectedRoute role="member">
              <UserSettings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
