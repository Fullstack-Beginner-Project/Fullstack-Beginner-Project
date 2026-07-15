import {
  enums,
  object,
  optional,
  refine,
  string,
  validate,
} from 'superstruct';



const MIN_PAGE = 1;
const MIN_PAGE_SIZE = 1;

const Page = refine(string(), 'Page', (value) => {
  const pageNumber = Number(value);

  return (
    Number.isInteger(pageNumber) &&
    pageNumber >= MIN_PAGE
  );
});

const PageSize = refine(string(), 'PageSize', (value) => {
  const pageSizeNumber = Number(value);

  return (
    Number.isInteger(pageSizeNumber) &&
    pageSizeNumber >= MIN_PAGE_SIZE
  );
});



// ==================================================
// 준원 - 비교 현황 조회 API validator 시작
// 나중에 compare-validator.js로 이동할 블록
// ==================================================

const COMPARE_STATUS_SORT_VALUES = [
  'selectCountDesc',
  'selectCountAsc',
  'investmentDesc',
  'investmentAsc',
];

const CompareStatusSort = enums(COMPARE_STATUS_SORT_VALUES);

const CompareStatusQuery = object({
  page: optional(Page),
  pageSize: optional(PageSize),
  sort: optional(CompareStatusSort),
});

function validateCompareStatusQuery(query) {
  const [error] = validate(query, CompareStatusQuery);

  if (error) {
    return {
      error: '잘못된 요청입니다.',
    };
  }

  const {
    page = '1',
    pageSize = '10',
    sort = 'selectCountDesc',
  } = query;

  const pageNumber = Number(page);
  const pageSizeNumber = Number(pageSize);

  return {
    value: {
      pageNumber,
      pageSizeNumber,
      sort,
    },
  };
}



// ==================================================
// 준원 - 비교 현황 조회 API validator 끝
// ==================================================

export {
  validateCompareStatusQuery,
};