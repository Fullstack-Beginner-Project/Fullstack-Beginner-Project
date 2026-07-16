import { Link, useNavigate } from 'react-router-dom';


function TableRow({ row, rowIndex, columnDefs, myCompany, onOpenCommentMenu, currentPage, rowsPerPage }) {

  const formatAmount = (value) => {
    const amount = Number(value);

    if (!amount) return "0원";
    if (amount >= 100_000_000) return `${(amount / 100_000_000).toLocaleString()}억 원`;
    if (amount >= 10_000_000) return `${(amount / 10_000_000).toLocaleString()}천만 원`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toLocaleString()}백만 원`;

    return `${amount.toLocaleString()}원`;
  };

  const renderCell = (column) => {
    const value = row[column.key];

    // console.log("column.key:", column.key);
    // console.log("value:", value);

    switch (column.key) {
      case "own_rank":
        return (
          <td key={column.key} className={column.className}>
            <div className="td_inner">
              {row.rank}위
            </div>
          </td>
        );


      case "rank":
        // 페이지네이션 반영
        const rankNumber = (currentPage - 1) * rowsPerPage + (rowIndex + 1);
        return (
          <td key={column.key} className={column.className}>
            <div className="td_inner">
              {rankNumber}위
            </div>
          </td>
        );

      case "name":
        return (
          <td key={column.key} className={'title'}>
            <Link to={`/company/${row.id}`} className="company_link td_inner" onClick={(e) => e.stopPropagation()}
            >
              <div className="img_wrap object_fit_cover">
                <img src={row.img || row.logo} alt={`${value} 기업 로고`} />
              </div>
              <span className="c_nm">
                <span className="ellipsis">{value}</span>
              </span>
            </Link>
          </td>
        );

      case "description":
        return (
          <td key={column.key} className={'content overflow'}>
            <div className="td_inner">
              <p className="text">
                {value}
              </p>
            </div>
          </td>
        );

      case "category":
        return (
          <td key={column.key} className={column.className}>
            <div className="td_inner">
              {value}
            </div>
          </td>
        );

      case "actualInvestmentAmount":
        return (
          <td key={column.key} className={column.className}>
            <div className="td_inner">
              {formatAmount(value)}
            </div>
          </td>
        );

      case "revenue":
        return (
          <td key={column.key} className={column.className}>
            <div className="td_inner">
              {formatAmount(value)}
            </div>
          </td>
        );

      case "amount":
        return (
          <td key={column.key} className={column.className}>
            <div className="td_inner">
              {formatAmount(value)}
            </div>
          </td>
        );

      case "employeeCount":
        return (
          <td key={column.key} className={column.className}>
            <div className="td_inner">
              {value?.toLocaleString("ko-KR")}명
            </div>
          </td>
        );

      case "comment":
        return (
          <td key={column.key} className={'content comment'}>
            <div className="td_inner">
              <p className="text">
                {value}
              </p>
              <form action="">
                <button type="button" className='btn_comment_menu' onClick={(event) => { onOpenCommentMenu?.(event, row); }}>
                  <span className="no_text">코멘트 메뉴</span>
                </button>
              </form>

            </div>
          </td>
        );

      default:
        return (
          <td key={column.key} className={column.className}>
            <div className="td_inner">
              {value}
            </div>
          </td>
        );
    }
  };

  console.log(myCompany)
  console.log('row.id******************')
  console.log(row.id)

  return (
    <tr className={row.id === myCompany ? "selection" : undefined}>
      {columnDefs.map((column) => {
        return renderCell(column);
      })}
    </tr>
  );
}

export default TableRow;