import { NavLink } from 'react-router-dom';
import logoImg from '../assets/images/icon_view_logo.png';
import '../assets/css/globalNav.css';



// 상단 네비게이션 메뉴 목록 (라벨과 이동 경로)
const NAV_ITEMS = [
  { label: '나의 기업 비교', to: '/my-company-compare' },
  { label: '비교 현황', to: '/compare-overview' },
  { label: '투자 현황', to: '/investment-status' },
];

function GlobalNav() {
  return (
    <header className="gnb_wrap">
      <NavLink to="/" className="gnb_logo">
        <img src={logoImg} alt="View my startup" />
      </NavLink>

      <nav className="gnb_nav">
        <ul>
          {NAV_ITEMS.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                // 현재 페이지와 일치하는 메뉴에 is-active 클래스 부여
                className={({ isActive }) =>
                  isActive ? 'gnb_link is-active' : 'gnb_link'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}



export default GlobalNav;