import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import ItemDetail from "./pages/ItemDetail";
import AddItem from "./pages/AddItem";
import Saved from "./pages/Saved";

import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <Toaster />

      <Routes>
        <Route element={<DashboardLayout />}>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/browse"
            element={<Browse />}
          />

          <Route
            path="/browse/:id"
            element={<ItemDetail />}
          />

          <Route
            path="/add"
            element={<AddItem />}
          />

          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <Saved />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <Navigate to="/" replace />
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;