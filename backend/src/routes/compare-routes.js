import { Router } from 'express';

import prisma from "../lib/prisma.js";
import { 
  validateCompareCompaniesQuery,
  validateCompareBody,
  validateCompareStatusQuery,
} from '../validators/compare-validator.js';



const compareRouter = Router();

function sendBadRequest(res, message = '잘못된 요청입니다.') {
  return res.status(400).json({
    status: 400,
    code: 'Bad Request',
    message,
  });
}

// DB의 id 필드를 API 응답용 companyId로 변환한다.
function serializeCompareCompany(company) {
  return {
    companyId: company.id,
    name: company.name,
    category: company.category,
  };
}

const COMPARE_STATUS_SORT_OPTIONS = {
  selectCountDesc: {
    myCompanySelectCount: 'desc',
  },
  selectCountAsc: {
    myCompanySelectCount: 'asc',
  },
  investmentDesc: {
    actualInvestmentAmount: 'desc',
  },
  investmentAsc: {
    actualInvestmentAmount: 'asc',
  },
};

function serializeCompareStatusCompany(company) {
  return {
    companyId: company.id,
    name: company.name,
    description: company.description,
    category: company.category,
    myCompanySelectCount: company.myCompanySelectCount,
    compareCompanySelectCount: company.compareCompanySelectCount
  };
}

compareRouter.get('/compare/companies', async (req, res) => {
  try {
    const { error, value } = validateCompareCompaniesQuery(req.query);

    if (error) {
      return sendBadRequest(res, error);
    }

    const {
      pageNumber,
      pageSizeNumber,
      keyword,
      compareCompanyIds,
    } = value;

    const selectedCompanyRows = compareCompanyIds.length
      ? await prisma.company.findMany({
        where: {
          id: {
            in: compareCompanyIds,
          },
        },
        select: {
          id: true,
          name: true,
          category: true,
        },
      })
      : [];

    const sortedSelectedCompanyRows = compareCompanyIds
      .map((companyId) => {
        return selectedCompanyRows.find((company) => {
          return company.id === companyId;
        });
      })
      .filter((company) => {
        return company;
      });

    const selectedCompanies = sortedSelectedCompanyRows.map((company) => {
      return serializeCompareCompany(company);
    });

    const where = keyword
      ? {
        name: {
          contains: keyword,
          mode: 'insensitive',
        },
      }
      : {};

    const skip = (pageNumber - 1) * pageSizeNumber;

    const total = await prisma.company.count({
      where,
    });

    const companyRows = await prisma.company.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      skip,
      take: pageSizeNumber,
      select: {
        id: true,
        name: true,
        category: true,
      },
    });

    const companies = companyRows.map((company) => {
      return serializeCompareCompany(company);
    });

    const totalPages = Math.ceil(total / pageSizeNumber);

    return res.status(200).json({
      selectedCompanies,
      companies,
      total,
      totalPages,
    });
  } catch (error) {
    console.error(error);

    return sendBadRequest(res);
  }
});

compareRouter.get('/compare/status', async (req, res) => {
  try {
    const { error, value } = validateCompareStatusQuery(req.query);

    if (error) {
      return sendBadRequest(res, error);
    }

    const {
      pageNumber,
      pageSizeNumber,
      sort,
    } = value;

    const skip = (pageNumber - 1) * pageSizeNumber;

    const companyRows = await prisma.company.findMany({
      orderBy: COMPARE_STATUS_SORT_OPTIONS[sort],
      skip,
      take: pageSizeNumber,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        myCompanySelectCount: true,
        compareCompanySelectCount: true,
      },
    });

    const total = await prisma.company.count();

    const companies = companyRows.map((company) => {
      return serializeCompareStatusCompany(company);
    });

    const totalPages = Math.ceil(total / pageSizeNumber);

    return res.status(200).json({
      companies,
      total,
      totalPages,
    });
  } catch (error) {
    console.error(error);

    return sendBadRequest(res);
  }
});

compareRouter.post('/compare', async (req, res) => {
  try {
    const { error, value } = validateCompareBody(req.body);

    if (error) {
      return sendBadRequest(res, error);
    }

    const {
      myCompanyIds,
      compareCompanyIds,
    } = value;

    const [myCompanyId] = myCompanyIds;

    await prisma.$transaction([
      prisma.company.update({
        where: {
          id: myCompanyId,
        },
        data: {
          myCompanySelectCount: {
            increment: 1,
          },
        },
      }),

      prisma.company.updateMany({
        where: {
          id: {
            in: compareCompanyIds,
          },
        },
        data: {
          compareCompanySelectCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return res.status(200).json({
      message: '기업 비교 요청 확인',
    });
  } catch (error) {
    console.error(error);

    return sendBadRequest(res);
  }
});

compareRouter.all('/compare/companies', (req, res) => {
  return sendBadRequest(res);
});

compareRouter.all('/compare/status', (req, res) => {
  return sendBadRequest(res);
});

compareRouter.all('/compare', (req, res) => {
  return sendBadRequest(res);
});


export default compareRouter;
