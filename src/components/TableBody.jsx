
import TableColgroup from "./TableColgroup";
import TableRow from "./TableRow"

function TableBody({ columnDefs, rows, loading = false, myCompany, currentPage, rowsPerPage, onEditInvestment, onDeleteInvestment, ...rowProps }) {

  return (
    <div className={`table_body_wrap${loading ? " is_loading" : ""}`}>
        {loading && ( 
          <div className="table_body_loading">
            로딩 중...
          </div>
        )}
        
        <table className="table_body">

          <TableColgroup columnDefs={columnDefs} />

          <tbody>

            {rows.map((row, rowIndex) => {
              return (
                <TableRow
                  key={row.id}
                  row={row}
                  rowIndex={rowIndex}
                  columnDefs={columnDefs}
                  myCompany={myCompany}
                  {...rowProps}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  onEditInvestment={onEditInvestment} onDeleteInvestment={onDeleteInvestment}
                />
              )
            })}

          </tbody>
        </table>
    </div>
  )
}

export default TableBody;