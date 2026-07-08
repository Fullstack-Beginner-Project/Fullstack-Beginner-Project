import './assets/css/reset.css'
import './assets/css/common.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Lobby from './pages/lobby.jsx';
import My_company_compare from './pages/my-company-compare.jsx';
import Compare_overview from './pages/compare-overview.jsx';
import Investment_status from './pages/investment-status.jsx';
import Company_detail from './pages/company-detail.jsx';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby/>}/>
        <Route path="/my-company-compare" element={<My_company_compare/>}/>
        <Route path="/compare-overview" element={<Compare_overview/>}/>
        <Route path="/investment-status" element={<Investment_status/>}/>
        <Route path="/company/:id" element={<Company_detail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
