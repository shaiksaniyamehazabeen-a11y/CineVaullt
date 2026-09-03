import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import ItemDetail from "./pages/ItemDetail";
import AddItem from "./pages/AddItem";
import Saved from "./pages/Saved";

function App() {
  return (
    <Routes>
      {/* Main application layout */}
      <Route element={<DashboardLayout />}>
        {/* Dashboard must open at / */}
        <Route path="/" element={<Dashboard />} />

        {/* Browse movies */}
        <Route path="/browse" element={<Browse />} />

        {/* Movie details */}
        <Route path="/browse/:id" element={<ItemDetail />} />

        {/* Add movie form */}
        <Route path="/add" element={<AddItem />} />

        {/* Protected saved movies page */}
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <Saved />
            </ProtectedRoute>
          }
        />

        {/* Unknown URLs go to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;