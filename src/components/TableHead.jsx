import TableColgroup from "./TableColgroup";

function TableHead({ columnDefs }) {
  return (
    <div className="table_head_wrap">
      <table className="table_head">

        <TableColgroup columnDefs={columnDefs} />

        

        <thead>
          <tr>
            {columnDefs.map((column) => (
              <th key={column.key}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

      </table>

    </div>
  )
}

export default TableHead;