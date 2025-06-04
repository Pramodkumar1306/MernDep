import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SiteSelection from "./components/SiteSelection";
import SitePage from "./pages/SitePage";
import LoginPage from "./pages/LoginPage";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const isAuth = Cookies.get("auth") === "true";
    setIsLoggedIn(isAuth);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <SiteSelection /> : <Navigate to="/login" />}
        />
        <Route
          path="/site/:site"
          element={isLoggedIn ? <SitePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
