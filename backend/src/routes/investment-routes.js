import express from 'express';
import prisma from '../lib/prisma.js';
import { validatePatchInvestmentBody } from '../validators/invest-validator.js';
const router = express.Router();

router.patch('/investments', async (req, res) => {
  try {
    const {
      investmentsId,
      investorName,
      amount,
      comment,
      password,
    } = req.body;

    const error = validatePatchInvestmentBody(req.body);

    if (error) {
      return res.status(400).json({
        status: 400,
        code: 'Bad Request',
        message: error,
      });
    }

    const investment = await prisma.investment.findUnique({
      where: {
        id: investmentsId,
      },
    });
    if (!investment) {
      return res.status(400).json({
        status: 400,
        code: 'Bad Request',
        message: '투자 정보를 찾을 수 없습니다.'
      });
    }

    const updatedInvestment = await prisma.investment.update({
      data :{
        
      }
    })

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      status: 400,
      code: 'Bad Request',
      message: '서버 오류가 발생했습니다.',
    });
  }
});


export default router;