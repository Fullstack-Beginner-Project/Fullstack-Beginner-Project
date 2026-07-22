import {
  object,
  string,
  optional,
  refine,
  enums,
  validate,
} from 'superstruct';



const COMPANY_ID_REGEX = /^[a-z0-9]{6}$/;

const MIN_PAGE = 1;
const MIN_PAGE_SIZE = 1;

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

const FAVORITE_SORT_VALUES = [
  'favoriteAsc',
  'favoriteDesc',
];

const FavoriteSort = enums(FAVORITE_SORT_VALUES);

const FavoriteCompanyIds = refine(string(), 'FavoriteCompanyIds', (value) => {
  if (value.trim() === '') {
    return true;
  }

  const companyIds = value
    .split(',')
    .map((companyId) => companyId.trim());

  const hasEmptyCompanyId = companyIds.some((companyId) => {
    return companyId === '';
  });

  if (hasEmptyCompanyId) {
    return false;
  }

  const hasInvalidCompanyId = companyIds.some((companyId) => {
    return !COMPANY_ID_REGEX.test(companyId);
  });

  if (hasInvalidCompanyId) {
    return false;
  }

  const uniqueCompanyIds = new Set(companyIds);

  return uniqueCompanyIds.size === companyIds.length;
});

const FavoriteCompaniesQuery = object({
  favoriteCompanyIds: optional(FavoriteCompanyIds),
  page: optional(Page),
  pageSize: optional(PageSize),
  sort: optional(FavoriteSort),
});

function validateFavoriteCompaniesQuery(query) {
  const [error] = validate(query, FavoriteCompaniesQuery);

  if (error) {
    return {
      error: '잘못된 요청입니다.',
    };
  }

  const {
    favoriteCompanyIds = '',
    page = '1',
    pageSize = '10',
    sort = 'favoriteDesc',
  } = query;

  const pageNumber = Number(page);
  const pageSizeNumber = Number(pageSize);

  const parsedFavoriteCompanyIds = favoriteCompanyIds.trim() === ''
    ? []
    : favoriteCompanyIds
      .split(',')
      .map((companyId) => companyId.trim());

  return {
    value: {
      favoriteCompanyIds: parsedFavoriteCompanyIds,
      pageNumber,
      pageSizeNumber,
      sort,
    },
  };
}

export {
  validateFavoriteCompaniesQuery,
};
