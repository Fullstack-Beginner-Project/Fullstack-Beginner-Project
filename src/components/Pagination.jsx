import '../assets/css/pagination.css';

const GROUP_SIZE = 5;

function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxStart = Math.max(totalPages - GROUP_SIZE + 1, 1);
  const start = Math.min(Math.max(currentPage - GROUP_SIZE + 1, 1), maxStart);
  const end = Math.min(start + GROUP_SIZE - 1, totalPages);

  const pageNumbers = [];
  for (let page = start; page <= end; page++) pageNumbers.push(page);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="pagination_wrap">
      <button
        type="button"
        className="btn_left"
        disabled={currentPage === 1}
        onClick={handlePrev}
      >
        {'<'}
      </button>

      <ul className="page">
        {pageNumbers.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={page === currentPage ? 'page_number is-active' : 'page_number'}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn_right"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        {'>'}
      </button>
    </div>
  );
}

export default Pagination;
