import { ThemeProvider } from "@/components/common/theme-provider";
import ThemeToggle from "@/components/common/theme-toggle";
import Login from "@/pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <ThemeToggle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default AppRoutes;
