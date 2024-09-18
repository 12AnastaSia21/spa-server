import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import MainPage from "./MainPage";
import TokenProvider from "./TokenContext";

function App() {
  return (
    <TokenProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/table" element={<MainPage />} />
        </Routes>
      </Router>
    </TokenProvider>
  );
}

export default App;
