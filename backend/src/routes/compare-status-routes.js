import { Router } from "express";

import prisma from "../lib/prisma.js";
import { validateCompareStatusQuery } from "../validators/compare-status-validator.js";



const compareStatusRouter = Router();

function sendBadRequest(res, message = '잘못된 요청입니다.') {
  return res.status(400).json({
    status: 400,
    code: 'Bad Request',
    message,
  });
}

// ==================================================
// 준원 - 비교 현황 조회 API route 시작
// 나중에 compare-routes.js로 이동할 블록
// ==================================================

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
    conpanyId : company.id,
    name: company.name,
    description: company.description,
    category: company.category,
    myCompanySelectCount: company.myCompanySelectCount,
    compareCompanySelectCount: company.compareCompanySelectCount
  };
}

compareStatusRouter.get('/compare/status', async (req, res) => {
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

compareStatusRouter.all('/compare/status', (req, res) => {
  return sendBadRequest(res);
});

// ==================================================
// 준원 - 비교 현황 조회 API route 끝
// ==================================================

export default compareStatusRouter;