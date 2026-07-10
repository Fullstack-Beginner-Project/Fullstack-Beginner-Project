
import '../assets/css/table.css'
import TableHead from './TableHead';
import TableBody from './TableBody';

function Table() {

  let company = {
    id: 3154,
  }
  return (
    <div className="table_conatiner">
      <div className="overflow_x">
        <div className="table_wrap">

          <TableHead></TableHead>

          <TableBody company={company}></TableBody>

        </div>
      </div>
    </div>
  )
}

export default Table; 