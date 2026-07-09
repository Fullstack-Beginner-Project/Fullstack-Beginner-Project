import { Router } from 'express';
import { randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';

import prisma from '../lib/prisma.js';
import { validateCreateInvestmentBody } from '../validators/invest-validator.js';
import { validatePatchInvestmentBody } from '../validators/invest-validator.js';



const INVESTMENT_ID_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const INVESTMENT_ID_LENGTH = 6;
const MAX_ID_GENERATION_RETRY_COUNT = 10;
const INVESTMENT_ID_GENERATION_ERROR_MESSAGE = '투자 ID 생성에 실패했습니다.';
const investmentRouter = Router();


function sendBadRequest(res, message = '잘못된 요청입니다.') {
  return res.status(400).json({
    status: 400,
    code: 'Bad Request',
    message,
  });
}

function isJsonRequest(req) {
  return req.is('application/json');
}

function generateRandomInvestmentId() {
  let id = '';
  for (let i = 0; i < INVESTMENT_ID_LENGTH; i += 1) {
    const randomIndex = randomInt(INVESTMENT_ID_CHARACTERS.length);
    id += INVESTMENT_ID_CHARACTERS[randomIndex];
  }
  return id;
}

function isUniqueConstraintError(error) {
  return error?.code === 'P2002';
}

async function createInvestmentWithGeneratedId(data) {
  for (let count = 0; count < MAX_ID_GENERATION_RETRY_COUNT; count += 1) {
    const id = generateRandomInvestmentId();
    try {
      return await prisma.investment.create({
        data: {
          id,
          ...data,
        },
        select: {
          id: true,
          companyId: true,
          investorName: true,
          amount: true,
          comment: true,
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        continue;
      }
      throw error;
    }
  }
  throw new Error(INVESTMENT_ID_GENERATION_ERROR_MESSAGE);
}

investmentRouter.post('/investments', async (req, res) => {
  try {
    if (!isJsonRequest(req)) {
      return sendBadRequest(res);
    }
    const validationError = validateCreateInvestmentBody(req.body);
    if (validationError) {
      return sendBadRequest(res);
    }
    const {
      companyId,
      investorName,
      amount,
      comment,
      password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const investment = await createInvestmentWithGeneratedId({
      companyId,
      investorName: investorName.trim(),
      amount: BigInt(amount),
      comment: comment?.trim() || null,
      password: hashedPassword,
    });
    return res.status(200).json({
      investment,
    });
  } catch (error) {
    console.error(error);
    if (error.message === INVESTMENT_ID_GENERATION_ERROR_MESSAGE) {
      return sendBadRequest(res, INVESTMENT_ID_GENERATION_ERROR_MESSAGE);
    }
    return sendBadRequest(res);
  }
});

investmentRouter.patch('/investments', async (req, res) => {
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
    const isPasswordMatch = await bcrypt.compare(password, investment.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        status: 400,
        code: 'Bad Request',
        message: '비밀번호가 일치하지 않습니다.',
      });
    }
    const updatedInvestment = await prisma.investment.update({
      where: {
        id: investmentsId,
      },
      data: {
        investorName: investorName.trim(),
        amount: BigInt(amount),
        comment: comment?.trim() || null,
      },
      select: {
        id: true,
        companyId: true,
        investorName: true,
        amount: true,
        comment: true,
      },
    });
    return res.status(200).json({
      investment: updatedInvestment,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: 400,
      code: 'Bad Request',
      message: '서버 오류가 발생했습니다.',
    });
  }
});

investmentRouter.all('/investments', (req, res) => {
  return sendBadRequest(res);
});

export default investmentRouter;