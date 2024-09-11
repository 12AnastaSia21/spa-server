import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './SignIn';
import FullFeaturedCrudGrid from './DataTable';

function App() {
 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/table" element={<FullFeaturedCrudGrid />} />
      </Routes>
    </Router>
  )
}



export default App
