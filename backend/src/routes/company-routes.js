import { Router } from 'express';

import prisma from '../lib/prisma.js';

import {
  validateCompanyListQuery,
  validateCompanyIdParam,
  validateCompanyInvestmentsQuery,
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

const companyRouter = Router();

function sendBadRequest(res, message = '잘못된 요청입니다.') {
  return res.status(400).json({
    status: 400,
    code: 'Bad Request',
    message,
  });
}


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

    const totalCount = await prisma.investment.count({
      where,
    });

    return res.status(200).json({
      list: investments,
      totalCount,
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