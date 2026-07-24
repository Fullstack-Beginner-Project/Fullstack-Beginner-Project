import { Router } from 'express';

import prisma from '../lib/prisma.js';

import {
  validateCompanyListQuery,
  validateCompanyIdParam,
  validateCompanyInvestmentsQuery,
  validateMyCompanyQuery,
} from '../validators/company-validator.js';




//query로 들어온 문자열을 orderBy객체로 바꿔줌
const SORT_OPTIONS = {
  investmentDesc: {
    actualInvestmentAmount: 'desc',
  },
  investmentAsc: {
    actualInvestmentAmount: 'asc',
  },
  revenueDesc: {
    revenue: 'desc',
  },
  revenueAsc: {
    revenue: 'asc',
  },
  employeeDesc: {
    employeeCount: 'desc',
  },
  employeeAsc: {
    employeeCount: 'asc',
  },
};

//order option 값 
const ORDER_OPTIONS = [
  'desc',
  'asc',
];

//orderBy 값
const ORDER_BY_OPTIONS = [
  'userInvestmentAmount',
  'actualInvestmentAmount'
]



const companyRouter = Router();

function sendBadRequest(res, message = '잘못된 요청입니다.') {
  return res.status(400).json({
    status: 400,
    code: 'Bad Request',
    message,
  });
}

function toSafeNumber(value) {
  return typeof value === 'bigint' ? Number(value) : value;
}

// ==================================================
// 윤여진 - 투자 현황 조회 API 시작
// ==================================================

companyRouter.get('/companies/investmentStatus', async (req, res) => {
  try {
    const {
      page = '1',
      pageSize = '10',
      orderBy = 'userInvestmentAmount',
      order = 'desc',
    } = req.query;

    if (
      typeof page !== 'string' ||
      typeof pageSize !== 'string' ||
      typeof orderBy !== 'string' ||
      typeof order !== 'string'
    ) {
      return sendBadRequest(res);
    }

    const pageNumber = Number(page);
    const pageSizeNumber = Number(pageSize);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      return sendBadRequest(res);
    }

    if (!Number.isInteger(pageSizeNumber) || pageSizeNumber < 1) {
      return sendBadRequest(res);
    }

    if (!ORDER_OPTIONS.includes(order)) {
      return sendBadRequest(res);
    }

    if (!ORDER_BY_OPTIONS.includes(orderBy)) {
      return sendBadRequest(res);
    }

    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        actualInvestmentAmount: true,
        investments: {
          select: {
            amount: true,
          },
        },
      },
    });

    const companiesWithInvestmentAmount = companies.map((company) => {
      const userInvestmentAmount = company.investments.reduce(
        (sum, investment) => sum + investment.amount,
        0n
      );

      const { investments, ...companyInfo } = company;

      return {
        ...companyInfo,
        userInvestmentAmount,
      };
    });

    companiesWithInvestmentAmount.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue === bValue) {
        return a.name.localeCompare(b.name);
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : 1;
      }

      return aValue > bValue ? -1 : 1;
    });

    const skip = (pageNumber - 1) * pageSizeNumber;

    const list = companiesWithInvestmentAmount.slice(
      skip,
      skip + pageSizeNumber
    );

    return res.status(200).json({
      list,
      totalCount: companiesWithInvestmentAmount.length,
    });
  } catch (error) {
    console.error(error);
    return sendBadRequest(res);
  }
});


// ==================================================
// 윤여진 - 투자 현황 조회 API 끝
// ==================================================


companyRouter.get('/companies', async (req, res) => {
  try {
    const { error, value } = validateCompanyListQuery(req.query);

    if (error) {
      return sendBadRequest(res, error);
    }

    const {
      pageNumber,
      pageSizeNumber,
      keyword,
      sort,
    } = value;

    const skip = (pageNumber - 1) * pageSizeNumber;

    const where = keyword
      ? {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        }
      : {};

    const companies = await prisma.company.findMany({
      where,
      orderBy: SORT_OPTIONS[sort],
      skip,
      take: pageSizeNumber,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        actualInvestmentAmount: true,
        revenue: true,
        employeeCount: true,
      },
    });

    const totalCount = await prisma.company.count({
      where,
    });

    return res.status(200).json({
      list: companies,
      totalCount,
    });
  } catch (error) {
    console.error(error);

    return sendBadRequest(res);
  }
});

companyRouter.get('/companies/my-company', async (req, res) => {
  try {
    const { error, value } = validateMyCompanyQuery(req.query);

    if (error) {
      return sendBadRequest(res, error);
    }

    const {
      pageNumber,
      pageSizeNumber,
      keyword,
      recentCompanyIds,
    } = value;

    const skip = (pageNumber - 1) * pageSizeNumber;

    const where = keyword
      ? {
        name: {
          contains: keyword,
          mode: 'insensitive',
        },
      }
    : {};

    const recentCompanies = recentCompanyIds.length > 0
      ? await prisma.company.findMany({
        where: {
          id: {
            in: recentCompanyIds,
          },
        },
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          name: true,
          category: true,
        },
      })
    : [];

    const companies = await prisma.company.findMany({
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

    const totalCount = await prisma.company.count({
      where,
    });

    return res.status(200).json({
      recentCompanies,
      companies,
      totalCount,
    });
  } catch (error) {
    console.error(error);

    return sendBadRequest(res);
  }
});

companyRouter.get('/companies/:companyId', async (req, res) => {
  try {
    const { error, value } = validateCompanyIdParam(req.params);

    if (error) {
      return sendBadRequest(res, error);
    }

    const { companyId } = value;

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        actualInvestmentAmount: true,
        revenue: true,
        employeeCount: true,
      },
    });

    if (!company) {
      return sendBadRequest(res);
    }

    return res.status(200).json({
      company,
    });
  } catch (error) {
    console.error(error);

    return sendBadRequest(res);
  }
});

companyRouter.get('/companies/:companyId/investments', async (req, res) => {
  try {
    const paramsValidation = validateCompanyIdParam(req.params);

    if (paramsValidation.error) {
      return sendBadRequest(res, paramsValidation.error);
    }

    const queryValidation = validateCompanyInvestmentsQuery(req.query);

    if (queryValidation.error) {
      return sendBadRequest(res, queryValidation.error);
    }

    const { companyId } = paramsValidation.value;

    const {
      pageNumber,
      pageSizeNumber,
    } = queryValidation.value;

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        id: true,
      },
    });

    if (!company) {
      return sendBadRequest(res);
    }

    const skip = (pageNumber - 1) * pageSizeNumber;

    const where = {
      companyId,
    };

    const investments = await prisma.investment.findMany({
      where,
      orderBy: {
        amount: 'desc',
      },
      skip,
      take: pageSizeNumber,
      select: {
        id: true,
        companyId: true,
        investorName: true,
        amount: true,
        comment: true,
      },
    });

    const investmentSummary = await prisma.investment.aggregate({
      where,
      _count: true,
      _sum: {
        amount: true,
      },
    });

    return res.status(200).json({
      list: investments,
      totalCount: investmentSummary._count,
      totalAmount: investmentSummary._sum.amount ?? 0n,
    });
  } catch (error) {
    console.error(error);

    return sendBadRequest(res);
  }
});

companyRouter.get('/companies/:companyId/investments/chart', async (req, res) => {
  try {
    const paramsValidation = validateCompanyIdParam(req.params);

    if (paramsValidation.error) {
      return sendBadRequest(res, paramsValidation.error);
    }

    const { companyId } = paramsValidation.value;

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        id: true,
      },
    });

    if (!company) {
      return sendBadRequest(res);
    }

    const investments = await prisma.investment.findMany({
      where: {
        companyId,
      },
      select: {
        id: true,
        companyId: true,
        amount: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      list: investments,
    });
  } catch (error) {
    console.error(error);

    return sendBadRequest(res);
  }
});


companyRouter.all('/companies', (req, res) => {
  return sendBadRequest(res);
});

companyRouter.all('/companies/:companyId', (req, res) => {
  return sendBadRequest(res);
});

companyRouter.all('/companies/:companyId/investments', (req, res) => {
  return sendBadRequest(res);
});

export default companyRouter;