import { Link, useNavigate } from 'react-router-dom';

function Table() {
    return (
        <div className="table_wrap">

            <div className="table_head_wrap">
                <table className="table_head">

                    <thead>
                        <tr>
                            <th className="short">순위</th>
                            <th className="title">기업명</th>
                            <th className="content">기업소개</th>
                            <th className="etc">카테고리</th>
                            <th className="etc">누적 투자 금액</th>
                            <th className="etc_2">매출액</th>
                            <th className="etc_2">매출액</th>
                        </tr>
                    </thead>
                </table>

            </div>

            <div className="table_body_wrap">
                <table className="table_body">
                    <thead>
                        {/* 기업명 클릭으로 이동 */}
                        <tr onClick={() => navigate(`/company/${company.id}`)}>
                            <td className="short"></td>
                            <td className="title">
                                <Link to={`/company/${company.id}`} className="company-link" onClick={(e) => e.stopPropagation()}>
                                
                                </Link>
                            </td>
                            <td className="content"></td>
                            <td className="etc"></td>
                            <td className="etc"></td>
                            <td className="etc_2"></td>
                        </tr>
                    </thead>
                </table>
            </div>

        </div>
    )
}

export default Table; 