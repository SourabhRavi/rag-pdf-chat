import { ThemeProvider } from "@/components/common/theme-provider";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default AppRoutes;
