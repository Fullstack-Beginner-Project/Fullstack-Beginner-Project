import { Link, useNavigate } from 'react-router-dom';
import TableColgroup from "./TableColgroup";

function TableBody({ company }) {

  console.log(company.id)
  return (
    <div className="table_body_wrap">
      <table className="table_body">

        <TableColgroup />

        <tbody>
          {/* 기업명 클릭으로 이동 */}
          <tr>
            <td className="">
              <div className="td_inner">1위</div>
            </td>
            <td className="title">
              <Link to={`/company/${company.id}`} className="company_link td_inner" onClick={(e) => e.stopPropagation()}>
                <div className="img_wrap object_fit_cover">
                  <img src="src/assets/images/img_bi_codeit.webp" alt={`기업 로고`} />
                </div>
                <span className="c_nm">
                  <span className="ellipsis">코드잇</span>
                </span>
              </Link>
            </td>
            <td className="content">
              <div className="td_inner">
                <p className="text">코드잇은 ‘온라인 코딩 교육 서비스’를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수차례 연구로 획일화를 벗어났습니다.</p>
              </div>
            </td>
            <td className="">
              <div className="td_inner">에듀테크</div>
            </td>
            <td className="">
              <div className="td_inner">140억 원</div>
            </td>
            <td className="">
              <div className="td_inner">50억 원</div>
            </td>
            <td className="">
              <div className="td_inner">68명</div>
            </td>
          </tr>
          <tr>
            <td className="">
              <div className="td_inner">2위</div>
            </td>
            <td className="title">
              <Link to={`/company/${company.id}`} className="company_link td_inner" onClick={(e) => e.stopPropagation()}>
                <div className="img_wrap object_fit_cover">
                  <img src="src/assets/images/img_bi_codeit.webp" alt={`기업 로고`} />
                </div>
                <span className="c_nm">
                  <span className="ellipsis">코드잇</span>
                </span>
              </Link>
            </td>
            <td className="content">
              <div className="td_inner">
                <p className="text">코드잇은 ‘온라인 코딩 교육 서비스’를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수차례 연구로 획일화를 벗어났습니다.</p>
              </div>
            </td>
            <td className="">
              <div className="td_inner">에듀테크</div>
            </td>
            <td className="">
              <div className="td_inner">140억 원</div>
            </td>
            <td className="">
              <div className="td_inner">50억 원</div>
            </td>
            <td className="">
              <div className="td_inner">68명</div>
            </td>
          </tr>
          <tr>
            <td className="">
              <div className="td_inner">3위</div>
            </td>
            <td className="title">
              <Link to={`/company/${company.id}`} className="company_link td_inner" onClick={(e) => e.stopPropagation()}>
                <div className="img_wrap object_fit_cover">
                  <img src="src/assets/images/img_bi_codeit.webp" alt={`기업 로고`} />
                </div>
                <span className="c_nm">
                  <span className="ellipsis">코드잇</span>
                </span>
              </Link>
            </td>
            <td className="content">
              <div className="td_inner">
                <p className="text">코드잇은 ‘온라인 코딩 교육 서비스’를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수차례 연구로 획일화를 벗어났습니다.</p>
              </div>
            </td>
            <td className="">
              <div className="td_inner">에듀테크</div>
            </td>
            <td className="">
              <div className="td_inner">140억 원</div>
            </td>
            <td className="">
              <div className="td_inner">50억 원</div>
            </td>
            <td className="">
              <div className="td_inner">68명</div>
            </td>
          </tr>
          <tr>
            <td className="">
              <div className="td_inner">4위</div>
            </td>
            <td className="title">
              <Link to={`/company/${company.id}`} className="company_link td_inner" onClick={(e) => e.stopPropagation()}>
                <div className="img_wrap object_fit_cover">
                  <img src="src/assets/images/img_bi_codeit.webp" alt={`기업 로고`} />
                </div>
                <span className="c_nm">
                  <span className="ellipsis">코드잇</span>
                </span>
              </Link>
            </td>
            <td className="content">
              <div className="td_inner">
                <p className="text">코드잇은 ‘온라인 코딩 교육 서비스’를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수차례 연구로 획일화를 벗어났습니다.</p>
              </div>
            </td>
            <td className="">
              <div className="td_inner">에듀테크</div>
            </td>
            <td className="">
              <div className="td_inner">140억 원</div>
            </td>
            <td className="">
              <div className="td_inner">50억 원</div>
            </td>
            <td className="">
              <div className="td_inner">68명</div>
            </td>
          </tr>
          <tr>
            <td className="">
              <div className="td_inner">5위</div>
            </td>
            <td className="title">
              <Link to={`/company/${company.id}`} className="company_link td_inner" onClick={(e) => e.stopPropagation()}>
                <div className="img_wrap object_fit_cover">
                  <img src="src/assets/images/img_bi_codeit.webp" alt={`기업 로고`} />
                </div>
                <span className="c_nm">
                  <span className="ellipsis">코드잇</span>
                </span>
              </Link>
            </td>
            <td className="content">
              <div className="td_inner">
                <p className="text">코드잇은 ‘온라인 코딩 교육 서비스’를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수차례 연구로 획일화를 벗어났습니다.</p>
              </div>
            </td>
            <td className="">
              <div className="td_inner">에듀테크</div>
            </td>
            <td className="">
              <div className="td_inner">140억 원</div>
            </td>
            <td className="">
              <div className="td_inner">50억 원</div>
            </td>
            <td className="">
              <div className="td_inner">68명</div>
            </td>
          </tr>
          <tr>
            <td className="">
              <div className="td_inner">6위</div>
            </td>
            <td className="title">
              <Link to={`/company/${company.id}`} className="company_link td_inner" onClick={(e) => e.stopPropagation()}>
                <div className="img_wrap object_fit_cover">
                  <img src="src/assets/images/img_bi_codeit.webp" alt={`기업 로고`} />
                </div>
                <span className="c_nm">
                  <span className="ellipsis">코드잇</span>
                </span>
              </Link>
            </td>
            <td className="content">
              <div className="td_inner">
                <p className="text">코드잇은 ‘온라인 코딩 교육 서비스’를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수차례 연구로 획일화를 벗어났습니다.</p>
              </div>
            </td>
            <td className="">
              <div className="td_inner">에듀테크</div>
            </td>
            <td className="">
              <div className="td_inner">140억 원</div>
            </td>
            <td className="">
              <div className="td_inner">50억 원</div>
            </td>
            <td className="">
              <div className="td_inner">68명</div>
            </td>
          </tr>
          <tr>
            <td className="">
              <div className="td_inner">7위</div>
            </td>
            <td className="title">
              <Link to={`/company/${company.id}`} className="company_link td_inner" onClick={(e) => e.stopPropagation()}>
                <div className="img_wrap object_fit_cover">
                  <img src="src/assets/images/img_bi_codeit.webp" alt={`기업 로고`} />
                </div>
                <span className="c_nm">
                  <span className="ellipsis">코드잇</span>
                </span>
              </Link>
            </td>
            <td className="content">
              <div className="td_inner">
                <p className="text">코드잇은 ‘온라인 코딩 교육 서비스’를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수차례 연구로 획일화를 벗어났습니다.</p>
              </div>
            </td>
            <td className="">
              <div className="td_inner">에듀테크</div>
            </td>
            <td className="">
              <div className="td_inner">140억 원</div>
            </td>
            <td className="">
              <div className="td_inner">50억 원</div>
            </td>
            <td className="">
              <div className="td_inner">68명</div>
            </td>
          </tr>
          <tr>
            <td className="">
              <div className="td_inner">8위</div>
            </td>
            <td className="title">
              <Link to={`/company/${company.id}`} className="company_link td_inner" onClick={(e) => e.stopPropagation()}>
                <div className="img_wrap object_fit_cover">
                  <img src="src/assets/images/img_bi_codeit.webp" alt={`기업 로고`} />
                </div>
                <span className="c_nm">
                  <span className="ellipsis">코드잇</span>
                </span>
              </Link>
            </td>
            <td className="content">
              <div className="td_inner">
                <p className="text">코드잇은 ‘온라인 코딩 교육 서비스’를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수차례 연구로 획일화를 벗어났습니다.</p>
              </div>
            </td>
            <td className="">
              <div className="td_inner">에듀테크</div>
            </td>
            <td className="">
              <div className="td_inner">140억 원</div>
            </td>
            <td className="">
              <div className="td_inner">50억 원</div>
            </td>
            <td className="">
              <div className="td_inner">68명</div>
            </td>
          </tr>
          <tr>
            <td className="">
              <div className="td_inner">9위</div>
            </td>
            <td className="title">
              <Link to={`/company/${company.id}`} className="company_link td_inner" onClick={(e) => e.stopPropagation()}>
                <div className="img_wrap object_fit_cover">
                  <img src="src/assets/images/img_bi_codeit.webp" alt={`기업 로고`} />
                </div>
                <span className="c_nm">
                  <span className="ellipsis">코드잇</span>
                </span>
              </Link>
            </td>
            <td className="content">
              <div className="td_inner">
                <p className="text">코드잇은 ‘온라인 코딩 교육 서비스’를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수차례 연구로 획일화를 벗어났습니다.</p>
              </div>
            </td>
            <td className="">
              <div className="td_inner">에듀테크</div>
            </td>
            <td className="">
              <div className="td_inner">140억 원</div>
            </td>
            <td className="">
              <div className="td_inner">50억 원</div>
            </td>
            <td className="">
              <div className="td_inner">68명</div>
            </td>
          </tr>
          <tr>
            <td className="">
              <div className="td_inner">10위</div>
            </td>
            <td className="title">
              <Link to={`/company/${company.id}`} className="company_link td_inner" onClick={(e) => e.stopPropagation()}>
                <div className="img_wrap object_fit_cover">
                  <img src="src/assets/images/img_bi_codeit.webp" alt={`기업 로고`} />
                </div>
                <span className="c_nm">
                  <span className="ellipsis">아이해이트디피컬트코딩</span>
                </span>
              </Link>
            </td>
            <td className="content">
              <div className="td_inner">
                <p className="text">코드잇은 ‘온라인 코딩 교육 서비스’를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수차례 연구로 획일화를 벗어났습니다.</p>
              </div>
            </td>
            <td className="">
              <div className="td_inner">에듀테크</div>
            </td>
            <td className="">
              <div className="td_inner">140억 원</div>
            </td>
            <td className="">
              <div className="td_inner">50억 원</div>
            </td>
            <td className="">
              <div className="td_inner">68명</div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  )
}

export default TableBody;