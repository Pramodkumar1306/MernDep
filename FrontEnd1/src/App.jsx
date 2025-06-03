import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteSelection from "./components/SiteSelection";
import SitePage from "./pages/SitePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SiteSelection />} />
        <Route path="/site/:site" element={<SitePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;