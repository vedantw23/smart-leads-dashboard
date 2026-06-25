import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);
