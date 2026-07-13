import { Router } from 'express';

import prisma from "../lib/prisma.js";
import { validateCompareCompaniesQuery } from '../validators/compare-validator.js';

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

compareRouter.all('/compare/companies', (req, res) => {
  return sendBadRequest(res);
});

export default compareRouter;
