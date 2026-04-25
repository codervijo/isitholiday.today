import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import CalculatorPage from "./pages/CalculatorPage";
import SeoPageRoute from "./pages/SeoPageRoute";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/holiday-checker" element={<CalculatorPage />} />
        <Route path="/:country" element={<SeoPageRoute />} />
        <Route path="/:country/:state" element={<SeoPageRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
