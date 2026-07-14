import {
  enums,
  object,
  optional,
  refine,
  string,
  validate,
} from 'superstruct';



const COMPANY_ID_REGEX = /^[a-z0-9]{6}$/;

const MIN_PAGE = 1;
const MIN_PAGE_SIZE = 1;

const COMPANY_SORT_VALUES = [
  'investmentDesc',
  'investmentAsc',
  'revenueDesc',
  'revenueAsc',
  'employeeDesc',
  'employeeAsc',
];

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

const CompanyId = refine(string(), 'CompanyId', (value) => {
  return COMPANY_ID_REGEX.test(value);
});

// enum: 목록중 정확히 하나와 일치하는 값만 허용
const CompanySort = enums(COMPANY_SORT_VALUES);

const CompanyListQuery = object({
  page: optional(Page),
  pageSize: optional(PageSize),
  keyword: optional(string()),
  sort: optional(CompanySort),
});

const CompanyIdParams = object({
  companyId: CompanyId,
});

const CompanyInvestmentsQuery = object({
  page: optional(Page),
  pageSize: optional(PageSize),
});
// 최근 선택한 기업은 없어도 됨
const MyRecentCompanyIds = refine(string(), 'MyRecentCompanyIds', (value) => {
  if (value.trim() === '') {
    return true;
  }

  const companyIds = value.split(',');

  return companyIds.every((companyId) => {
    return COMPANY_ID_REGEX.test(companyId.trim());
  });
});

const MyCompanyQuery = object({
  page: optional(Page),
  pageSize: optional(PageSize),
  keyword: optional(string()),
  myRecentCompanyIds: optional(MyRecentCompanyIds),
});

function validateCompanyListQuery(query) {
  const [error] = validate(query, CompanyListQuery);

  if (error) {
    return {
      error: '잘못된 요청입니다.',
    };
  }

  const {
    page = '1',
    pageSize = '10',
    keyword = '',
    sort = 'revenueDesc',
  } = query;

  const pageNumber = Number(page);
  const pageSizeNumber = Number(pageSize);
  const trimmedKeyword = keyword.trim();

  return {
    value: {
      pageNumber,
      pageSizeNumber,
      keyword: trimmedKeyword,
      sort,
    },
  };
}

function validateCompanyIdParam(params) {
  const [error] = validate(params, CompanyIdParams);

  if (error) {
    return {
      error: '잘못된 요청입니다.',
    };
  }

  return {
    value: {
      companyId: params.companyId,
    },
  };
}

function validateCompanyInvestmentsQuery(query) {
  const [error] = validate(query, CompanyInvestmentsQuery);

  if (error) {
    return {
      error: '잘못된 요청입니다.',
    };
  }

  const {
    page = '1',
    pageSize = '5',
  } = query;

  const pageNumber = Number(page);
  const pageSizeNumber = Number(pageSize);

  return {
    value: {
      pageNumber,
      pageSizeNumber,
    },
  };
}

function validateMyCompanyQuery(query) {
  const [error] = validate(query, MyCompanyQuery);

  if (error) {
    return {
      error: '잘못된 요청입니다.',
    };
  }

  const {
    page = '1',
    pageSize = '5',
    keyword = '',
    myRecentCompanyIds = '',
  } = query;

  const pageNumber = Number(page);
  const pageSizeNumber = Number(pageSize);
  const trimmedKeyword = keyword.trim();

  const recentCompanyIds = myRecentCompanyIds
    .split(',')
    .map((companyId) => {
      return companyId.trim();
    })
    .filter((companyId) => {
      return companyId !== '';
    });

  return {
    value: {
      pageNumber,
      pageSizeNumber,
      keyword: trimmedKeyword,
      recentCompanyIds,
    },
  };
}

export {
  validateCompanyListQuery,
  validateCompanyIdParam,
  validateCompanyInvestmentsQuery,
  validateMyCompanyQuery,
};