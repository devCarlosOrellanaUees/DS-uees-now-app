type PaginationProps = {
  limit: number,
  totalRegistros: number,
  currentPage: number;
  totalPages: number;
  onPageChangePage: (page: number) => void;
  onPageChangePrevious: (page: number) => void;
  onPageChangeNext: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  limit,
  totalRegistros,
  currentPage,
  totalPages,
  onPageChangePage,
  onPageChangePrevious,
  onPageChangeNext
}) => {

  // Lógica para páginas alrededor de la página actual
  const pagesAroundCurrent = Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
    // Calculamos un rango de páginas alrededor de la página actual, limitado por el total de páginas
    const page = Math.max(currentPage - 1, 1) + i;
    return page <= totalPages ? page : null; // Aseguramos que no exceda el total de páginas
  }).filter(page => page !== null); // Filtramos los valores nulos
  ;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03] px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Anterior</a>
        <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Siguiente</a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className=" text-gray-500 text-theme-sm dark:text-gray-400">
          <p>
            Presentando
            <span className="font-medium"> {limit} </span>
            registros de
            <span className="font-medium"> {totalRegistros}. </span>
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => onPageChangePrevious(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm"
          >
            Anterior
          </button>
          <div className="flex items-center gap-2">
            {currentPage > 3 &&
              <>
                <button
                  onClick={() => onPageChangePage(1)}
                  className={`px-4 py-2 rounded ${currentPage === 1
                    ? "bg-uees text-white"
                    : "text-gray-700 dark:text-gray-400"
                    } flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:blue-chas hover:text-brand-500 dark:hover:text-brand-500`}
                >
                  1
                </button>
                <span className="px-2">...</span>
              </>
            }

            {pagesAroundCurrent.map((page) => (
              <button
                key={page}
                onClick={() => onPageChangePage(page)}
                className={`px-4 py-2 rounded ${currentPage === page
                  ? "bg-uees text-white"
                  : "text-gray-700 dark:text-gray-400"
                  } flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:blue-chas hover:text-brand-500 dark:hover:text-brand-500`}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages - 2 && (
              <>
                <span className="px-2">...</span>
                <button
                  onClick={() => onPageChangePage(totalPages)}
                  className={`px-4 py-2 rounded ${currentPage === totalPages
                    ? "bg-uees text-white"
                    : "text-gray-700 dark:text-gray-400"
                    } flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:blue-chas hover:text-brand-500 dark:hover:text-brand-500`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => onPageChangeNext(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
