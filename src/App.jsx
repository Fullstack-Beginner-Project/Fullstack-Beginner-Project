import './assets/css/reset.css'
import './assets/css/common.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Lobby from './pages/Lobby.jsx';
import MyCompanyCompare from './pages/MyCompanyCompare.jsx';
import CompareOverview from './pages/CompareOverview.jsx';
import InvestmentStatus from './pages/InvestmentStatus.jsx';
import CompanyDetail from './pages/CompanyDetail.jsx';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby/>}/>
        <Route path="/my-company-compare" element={<MyCompanyCompare/>}/>
        <Route path="/compare-overview" element={<CompareOverview/>}/>
        <Route path="/investment-status" element={<InvestmentStatus/>}/>
        <Route path="/company/:id" element={<CompanyDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
