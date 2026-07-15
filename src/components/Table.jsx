
import '../assets/css/table.css'
import TableHead from './TableHead';
import TableBody from './TableBody';

function Table({ columnDefs, rows, myCompany, currentPage, rowsPerPage, ...rowProps }) {
  
  return (
    <div className="table_conatiner">
      <div className="overflow_x">
        <div className="table_wrap">

          <TableHead columnDefs={columnDefs}></TableHead>

          <TableBody columnDefs={columnDefs} rows={rows} myCompany={myCompany} currentPage={currentPage} rowsPerPage={rowsPerPage} {...rowProps}></TableBody>

        </div>
      </div>
    </div>
  )
}

export default Table; 