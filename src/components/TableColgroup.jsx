function TableColgroup({ columnDefs }) {

    return(
        <colgroup>
        {columnDefs.map((column) => (

            <col key={column.key} className={column.colClassName} />
            ))}
        </colgroup>
    )
}

export default TableColgroup;