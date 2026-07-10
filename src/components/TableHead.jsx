import TableColgroup from "./TableColgroup";

let arr = [
  {
    id: '1231', 
    rate: 1, 
    c_nm: 'codeit', 
    description: '코드잇은 ‘온라인 코딩 교육 서비스’를 운영하는 EdTech 스타트업입니다. 코딩 교육에 대한 수차례 연구로 획일화를 벗어났습니다.', 
    cetagory: 'edutech', 
    tuja: 102800000,
  }
]

function TableHead() {
  return (
    <div className="table_head_wrap">
      <table className="table_head">

        <TableColgroup />

        

        <thead>
          <tr>
            <th className="">순위</th>
            <th className="title">기업명</th>
            <th className="content">기업소개</th>
            <th className="">카테고리</th>
            <th className="">누적 투자 금액</th>
            <th className="">매출액</th>
            <th className="">매출액</th>
          </tr>
        </thead>

      </table>

    </div>
  )
}

export default TableHead;