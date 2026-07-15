import {
  array,
  object,
  string,
  optional,
  refine,
  validate,
} from 'superstruct';


const COMPANY_ID_REGEX = /^[a-z0-9]{6}$/;

const MIN_PAGE = 1;
const MIN_PAGE_SIZE = 1;
const MAX_COMPARE_COMPANY_COUNT = 5;
const CompanyId = refine(string(), 'CompanyId', (value) => {
  return COMPANY_ID_REGEX.test(value);
});

const Page = refine(string(), 'Page', (value) => {
  const pageNumber = Number(value);

  return Number.isInteger(pageNumber) && pageNumber >= MIN_PAGE;
});

const PageSize = refine(string(), 'PageSize', (value) => {
  const pageSizeNumber = Number(value);

  return (
    Number.isInteger(pageSizeNumber) &&
    pageSizeNumber >= MIN_PAGE_SIZE
  );
});

const CompareCompanyIds = refine(string(), 'CompareCompanyIds', (value) => {
  if (value.trim() === '') {
    return true;
  }

  const companyIds = value
    .split(',')
    .map((companyId) => companyId.trim());

  const hasEmptyCompanyId = companyIds.some((companyId) => {
    return companyId === '';
  });

  // 비어있는 companyId값 있으면 에러
  if (hasEmptyCompanyId) {
    return false;
  }

  if (companyIds.length > MAX_COMPARE_COMPANY_COUNT) {
    return false;
  }

  return companyIds.every((companyId) => {
    return COMPANY_ID_REGEX.test(companyId);
  });
});

const CompareCompaniesQuery = object({
  page: optional(Page),
  pageSize: optional(PageSize),
  keyword: optional(string()),
  compareCompanyIds: optional(CompareCompanyIds),
});

function validateCompareCompaniesQuery(query) {
  const [error] = validate(query, CompareCompaniesQuery);

  if (error) {
    return {
      error: '잘못된 요청입니다.',
    };
  }

  const {
    page = '1',
    pageSize = '5',
    keyword = '',
    compareCompanyIds = '',
  } = query;

  const pageNumber = Number(page);
  const pageSizeNumber = Number(pageSize);
  const trimmedKeyword = keyword.trim();

  // 선택한 기업 아이디 목록
  const parsedCompareCompanyIds = compareCompanyIds
    ? compareCompanyIds
      .split(',')
      .map((companyId) => companyId.trim())
    : [];

  return {
    value: {
      pageNumber,
      pageSizeNumber,
      keyword: trimmedKeyword,
      compareCompanyIds: parsedCompareCompanyIds,
    },
  };
}

function validateCompareBody(body) {
  const CompareBody = object({
    myCompanyIds: refine(array(CompanyId), 'MyCompanyIds', (value) => {
      return value.length === 1;
    }),
    compareCompanyIds: refine(
      array(CompanyId),
      'CompareCompanyIds',
      (value) => {
        return value.length >= 1 && value.length <= MAX_COMPARE_COMPANY_COUNT;
      }
    ),
  });

  const [error] = validate(body, CompareBody);

  if (error) {
    return {
      error: '잘못된 요청입니다.',
    };
  }

  return {
    value: body,
  };
}

export {
  validateCompareCompaniesQuery,
  validateCompareBody
};