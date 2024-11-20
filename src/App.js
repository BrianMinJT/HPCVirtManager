import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import Forbidden from "./pages/Forbidden";
import Login from "./pages/Login";
import PasswordForget from "./pages/PasswordForget";
import { ConfirmDialog } from "primereact/confirmdialog";
import { BreadcrumbProvider } from "./context/BreadcrumbContext";

function App() {
  return (
    <HashRouter>
      <BreadcrumbProvider>
        <div className="App">
          <ConfirmDialog />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forget-password" element={<PasswordForget />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/403" element={<Forbidden />} />
          </Routes>
          <ProtectedRoutes />
        </div>
      </BreadcrumbProvider>
    </HashRouter>
  );
}

export default App;
