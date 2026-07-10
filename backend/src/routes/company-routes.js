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

const companyRouter = Router();

function sendBadRequest(res, message = '잘못된 요청입니다.') {
  return res.status(400).json({
    status: 400,
    code: 'Bad Request',
    message,
  });
}

// BigInt는 JSON 응답하면 터질수 있어서 숫자변환 필요
function serializeCompany(company) {
  return {
    ...company,
    actualInvestmentAmount: Number(company.actualInvestmentAmount),
    revenue: Number(company.revenue),
  };
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

    const list = companies.map(serializeCompany);

    return res.status(200).json({
      list,
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



export default companyRouter;