import { NavLink } from 'react-router-dom';
import logoImg from '../assets/images/icon_viewlogo.png';
import '../assets/css/globalNav.css';



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