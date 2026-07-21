import { Link, useNavigate } from 'react-router-dom';
import { formatAmount } from '/src/utils/common.js'
import LogoImg from './LogoImg';


function TableRow({ row, rowIndex, columnDefs, myCompany, onOpenCommentMenu, currentPage, rowsPerPage, onEditInvestment, onDeleteInvestment }) {


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
                <LogoImg cId={row.id} cNm={value} />
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

      case "userInvestmentAmount":
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
              <form action="" className='comment_wrap'>
                <button type="button" className='btn_comment_menu'
                  onClick={(event) => {
                    const currentButton = event.currentTarget;
                    const wasClicked = currentButton.classList.contains('clicked');

                    document
                      .querySelectorAll('.btn_comment_menu.clicked')
                      .forEach((button) => {
                        button.classList.remove('clicked');
                      });

                    if (!wasClicked) {
                      currentButton.classList.add('clicked');
                    }
                  }}>
                  <span className="no_text">코멘트 메뉴</span>
                </button>
                <ul className="comment_menu">
                  <li><button type="button" onClick={() => onEditInvestment?.(row)}>수정하기</button></li>
                  <li><button type="button" onClick={() => onDeleteInvestment?.(row)}>삭제하기</button></li>
                </ul>
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

  // console.log(myCompany)
  // console.log('row.id******************')
  // console.log(row.id)

  return (
    <tr className={row.id === myCompany ? "selection" : undefined}>
      {columnDefs.map((column) => {
        return renderCell(column);
      })}
    </tr>
  );
}

export default TableRow;