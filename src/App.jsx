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
        <Route path="/" element={<Lobby/>}>
          {/* 기업 전체 리스트 */}
          <Route path="company-list" element={<MyCompanyCompare/>}/>
          {/* 나의 기업 비교 */}
          <Route path="my-company-compare" element={<MyCompanyCompare/>}/>
          {/* 비교 현황 */}
          <Route path="compare-overview" element={<CompareOverview/>}/> 
          {/* 투자 현황 */}
          <Route path="investment-status" element={<InvestmentStatus/>}/>
          {/* 기업 상세 */}
          <Route path="company/:id" element={<CompanyDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
