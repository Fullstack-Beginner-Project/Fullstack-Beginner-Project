import { Router } from 'express';

import prisma from '../lib/prisma.js';


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

const COMPANY_ID_REGEX = /^[a-z0-9]{6}$/;

const companyRouter = Router();

function sendBadRequest(res, message = '잘못된 요청입니다.') {
  return res.status(400).json({
    status: 400,
    code: 'Bad Request',
    message,
  });
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

function isValidCompanyId(companyId) {
  return typeof companyId === 'string' && COMPANY_ID_REGEX.test(companyId);
}

companyRouter.get('/companies', async (req, res) => {
  try {
    const {
      page = '1',
      pageSize = '10',
      keyword = '',
      sort = 'revenueDesc',
    } = req.query;

    if (
      typeof page !== 'string' ||
      typeof pageSize !== 'string' ||
      typeof keyword !== 'string' ||
      typeof sort !== 'string'
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

    if (!SORT_OPTIONS[sort]) {
      return sendBadRequest(res);
    }

    const trimmedKeyword = keyword.trim();
    const skip = (pageNumber - 1) * pageSizeNumber;

    const where = trimmedKeyword
      ? {
        name: {
          contains: trimmedKeyword,
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

companyRouter.get('/companies/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!isValidCompanyId(companyId)) {
      return sendBadRequest(res);
    }

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
    const { companyId } = req.params;

    if (!isValidCompanyId(companyId)) {
      return sendBadRequest(res);
    }

    const {
      page = '1',
      pageSize = '5',
    } = req.query;

    if (
      typeof page !== 'string' ||
      typeof pageSize !== 'string'
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

    const totalCount = await prisma.investment.count({
      where,
    });

    return res.status(200).json({
      list: investments,
      totalCount,
    });
  } catch (error) {
    console.error(error)

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