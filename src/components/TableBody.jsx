
import TableColgroup from "./TableColgroup";
import TableRow from "./TableRow"

function TableBody({ columnDefs, rows, myCompany, currentPage, rowsPerPage, ...rowProps }) {
  
  return (
    <div className="table_body_wrap">
      <table className="table_body">

        <TableColgroup columnDefs={columnDefs} />

        <tbody>
          
          {rows.map((row, rowIndex) => {
            return (
            <TableRow key={row.id} row={row} rowIndex={rowIndex} columnDefs={columnDefs} myCompany={myCompany} {...rowProps} currentPage={currentPage} rowsPerPage={rowsPerPage} />
            )
          })}

        </tbody>
      </table>
    </div>
  )
}

export default TableBody;