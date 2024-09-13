import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import FullFeaturedCrudGrid from "./DataTable";
import { TokenProvider } from "./TokenContext";

function App() {
  return (
    <TokenProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/table" element={<FullFeaturedCrudGrid />} />
        </Routes>
      </Router>
    </TokenProvider>
  );
}

export default App;
