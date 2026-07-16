import {
  array,
  enums,
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

const COMPARE_STATUS_SORT_VALUES = [
  'selectCountDesc',
  'selectCountAsc',
  'investmentDesc',
  'investmentAsc',
];

const COMPARE_RESULT_SORT_VALUES = [
  'investmentDesc',
  'investmentAsc',
  'revenueDesc',
  'revenueAsc',
  'employeeDesc',
  'employeeAsc',
];

const CompareStatusSort = enums(COMPARE_STATUS_SORT_VALUES);
const CompareResultSort = enums(COMPARE_RESULT_SORT_VALUES);

const CompareStatusQuery = object({
  page: optional(Page),
  pageSize: optional(PageSize),
  sort: optional(CompareStatusSort),
});

const MyCompanyIds = refine(string(), 'MyCompanyIds', (value) => {
  const companyIds = value
    .split(',')
    .map((companyId) => companyId.trim());

  const hasEmptyCompanyId = companyIds.some((companyId) => {
    return companyId === '';
  });

  if (hasEmptyCompanyId) {
    return false;
  }

  if (companyIds.length !== 1) {
    return false;
  }

  return COMPANY_ID_REGEX.test(companyIds[0]);
})

const CompareResultCompanyIds = refine(
  string(),
  'CompareResultCompanyIds',
  (value) => {
    const companyIds = value
      .split(',')
      .map((companyId) => companyId.trim());

    const hasEmptyCompanyId = companyIds.some((companyId) => {
      return companyId === '';
    });

    if (hasEmptyCompanyId) {
      return false;
    }

    if (
      companyIds.length < 1 ||
      companyIds.length > MAX_COMPARE_COMPANY_COUNT
    ) {
      return false;
    }

    const hasInvalidCompanyId = companyIds.some((companyId) => {
      return !COMPANY_ID_REGEX.test(companyId);
    });

    if (hasInvalidCompanyId) {
      return false;
    }
      // Id 중복 검사 
    const uniqueCompanyIds = new Set(companyIds);

    return uniqueCompanyIds.size === companyIds.length;
  }
);

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

const CompareResultQuery = object({
  myCompanyIds: MyCompanyIds,
  compareCompanyIds: CompareResultCompanyIds,
  sort: optional(CompareResultSort),
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

function validateCompareResultQuery(query) {
  const [error] = validate(query, CompareResultQuery);

  if (error) {
    return {
      error: '잘못된 요청입니다.',
    };
  }

  const {
    myCompanyIds,
    compareCompanyIds,
    sort = 'investmentDesc',
  } = query;

  const parsedMyCompanyIds = myCompanyIds
    .split(',')
    .map((companyId) => companyId.trim());

  const parsedCompareCompanyIds = compareCompanyIds
    .split(',')
    .map((companyId) => companyId.trim());
    
    // 나의 기업 -> 비교기업에 중복 검사
  const hasDuplicatedCompanyId = parsedMyCompanyIds.some((companyId) => {
    return parsedCompareCompanyIds.includes(companyId);
  });

  if (hasDuplicatedCompanyId) {
    return {
      error: '잘못된 요청입니다.',
    };
  }

  return {
    value: {
      myCompanyIds: parsedMyCompanyIds,
      compareCompanyIds: parsedCompareCompanyIds,
      sort,
    },
  };
}

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
  validateCompareBody,
  validateCompareStatusQuery,
  validateCompareResultQuery,
};