import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LeadsPage
from "./pages/LeadsPage";

import CreateLeadPage
from "./pages/CreateLeadPage";

import EditLeadPage
from "./pages/EditLeadPage";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LeadsPage />}
        />

        <Route
          path="/leads"
          element={<LeadsPage />}
        />

        <Route
          path="/leads/new"
          element={<CreateLeadPage />}
        />

        <Route
          path="/leads/:id/edit"
          element={<EditLeadPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;