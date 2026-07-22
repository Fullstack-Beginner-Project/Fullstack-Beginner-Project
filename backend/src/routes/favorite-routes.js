import { Router } from 'express';

import prisma from '../lib/prisma.js';
import { validateFavoriteCompaniesQuery } from '../validators/favorite-validator.js';



const favoriteRouter = Router();

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

function serializeFavoriteCompany(company) {
  return {
    id: company.id,
    name: company.name,
    description: company.description,
    category: company.category,
    actualInvestmentAmount: toSafeNumber(company.actualInvestmentAmount),
    revenue: toSafeNumber(company.revenue),
    employeeCount: company.employeeCount,
  };
}

favoriteRouter.get('/companies/favorites', async (req, res) => {
  try {
    const { error, value } = validateFavoriteCompaniesQuery(req.query);

    if (error) {
      return sendBadRequest(res, error);
    }

    const {
      favoriteCompanyIds,
      pageNumber,
      pageSizeNumber,
      sort,
    } = value;

    if (favoriteCompanyIds.length === 0) {
      return res.status(200).json({
        companies: [],
        total: 0,
        totalPages: 0,
      });
    }

    const companyRows = await prisma.company.findMany({
      where: {
        id: {
          in: favoriteCompanyIds,
        },
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

    const orderedCompanyRows = favoriteCompanyIds
      .map((companyId) => {
        return companyRows.find((company) => {
          return company.id === companyId;
        });
      })
      .filter((company) => {
        return company;
      });

    const sortedCompanyRows = sort === 'favoriteDesc'
      ? [...orderedCompanyRows].reverse()
      : orderedCompanyRows;

    const total = sortedCompanyRows.length;

    const skip = (pageNumber - 1) * pageSizeNumber;

    const paginatedCompanyRows = sortedCompanyRows.slice(
      skip,
      skip + pageSizeNumber
    );

    const companies = paginatedCompanyRows.map((company) => {
      return serializeFavoriteCompany(company);
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

favoriteRouter.all('/companies/favorites', (req, res) => {
  return sendBadRequest(res);
});

export default favoriteRouter;
