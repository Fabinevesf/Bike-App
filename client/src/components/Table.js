import { useState, useMemo } from 'react'
import { sortRows, filterRows, paginateRows, highlight} from '../helpers/helptable.js'
import { Pagination } from './Pagination'
import "../App.css"
const { DateTime } = require("luxon");


export const Table = ({ columns, rows, deleteClick} ) => {
  const [activePage, setActivePage] = useState(1)
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState({ order: 'asc', orderBy: 'id' })
  const rowsPerPage = 10

  const filteredRows = useMemo(() => filterRows(rows, filters), [rows, filters])
  const sortedRows = useMemo(() => sortRows(filteredRows, sort), [filteredRows, sort])
  const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage)

  const count = filteredRows.length
  const totalPages = Math.ceil(count / rowsPerPage)

  const handleSearch = (value, accessor) => {
    setActivePage(1)

    if (value) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [accessor]: value,
      }))
    } else {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters }
        delete updatedFilters[accessor]

        return updatedFilters
      })
    }
  }

  const handleSort = (accessor) => {
    setActivePage(1)
    setSort((prevSort) => ({
      order: prevSort.order === 'asc' && prevSort.orderBy === accessor ? 'desc' : 'asc',
      orderBy: accessor,
    }))
  }

  const clearAll = () => {
    setSort({ order: 'asc', orderBy: 'id' })
    setActivePage(1)
    setFilters({})
  }

   
  return (
    <>  
    <div className='container-fluid'>    
       <table id="table_to_highlight" className="table table-sm table-hover table-bordered w-auto" >
        <thead class="table-light">
          <tr>
            {columns.map((column) => {
              const sortIcon = () => {
                if (column.accessor === sort.orderBy) {
                  if (sort.order === 'asc') {
                    return '⬆️'
                  }
                  return '⬇️'
                } else {
                  return '️↕️'
                }
              }
              return (
                <th key={column.accessor} id={column.accessor} data-width="100">
                  <span>{column.label}</span>
                  <button onClick={() => handleSort(column.accessor)}>{sortIcon()}</button>
                </th>
              )
            })}
          </tr>
          <tr>
            {columns.map((column) => {
              return (
                <th scope="col">
                  <input
                    key={`${column.accessor}-search`}
                    type="search"
                    placeholder={`Search ${column.label}`}
                    value={filters[column.accessor]}
                    onChange={(event) => handleSearch(event.target.value, column.accessor)}
                  />
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody id='table'>
          {calculatedRows.map((row) => {
            return (
              <tr key={row.id} id={row.id} onClick={() => highlight(row.id)}>
                {columns.map((column) => {
                if((column.accessor==='departureTime')||(column.accessor==="returnTime")) {
                    return <td key={column.accessor}>{DateTime.fromISO(row[column.accessor]).toFormat('yyyy LLL dd HH:mm')}</td>
                  } else {                        
                    return <td key={column.accessor}>{row[column.accessor]}</td>
                }})}
              </tr>
            )})}
        </tbody>
      </table>

      {count > 0 ? (
        <Pagination
          activePage={activePage}
          count={count}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          setActivePage={setActivePage}
        />
      ) : (
        <p>No data found</p>
      )}

    </div>  
    <div>      
      
        <p>
          <button onClick={clearAll}>Clear all</button>
          <button onClick={() => deleteClick()}>Delete the selected row</button>
          {/* <button onClick={() => showStats()}>Show statistics</button> */}
        </p>
      
    </div>   
  
    </>
  )
}
