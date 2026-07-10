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

const COMPANY_ID_REGEX = /^[a-z0-9]{6}$/;

const companyRouter = Router();

function sendBadRequest(res, message = '잘못된 요청입니다.') {
  return res.status(400).json({
    status: 400,
    code: 'Bad Request',
    message,
  });
}

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