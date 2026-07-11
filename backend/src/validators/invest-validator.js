import {
  object, //body가 어떤 필드를 가져야 하는지 검사
  string, // 문자열인지 검사
  number, // 숫자인지 검사
  optional, // 없어도 되는 값 허용
  nullable, // null 허용
  refine, // string/number 이후 추가조건 검사
  validate, //검증 실행
} from 'superstruct';




const COMPANY_ID_REGEX = /^[a-z0-9]{6}$/;
const PASSWORD_REGEX = /^[A-Za-z0-9!@#$%^&*_+\-=,]+$/;

const MIN_INVESTOR_NAME_LENGTH = 2;
const MAX_INVESTOR_NAME_LENGTH = 40;

const MIN_INVESTOR_AMOUNT = 10;
const MAX_INVESTOR_AMOUNT = 10000000000;

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 32;

const MAX_COMMENT_LENGTH = 1000;



const CompanyId = refine(string(), 'CompanyId', (value) => {
  return COMPANY_ID_REGEX.test(value);
});

const InvestmentId = refine(string(), 'InvestmentId', (value) => {
  return COMPANY_ID_REGEX.test(value);
});

const CreatePassword = refine(string(), 'Password', (value) => {
  return (
    value.length >= MIN_PASSWORD_LENGTH &&
    value.length <= MAX_PASSWORD_LENGTH &&
    PASSWORD_REGEX.test(value)
  );
});

const AuthPassword = refine(string(), 'AuthPassword', (value) =>{
  return value.trim().length > 0;
});

const InvestorName = refine(string(), 'InvestorName', (value) => {
  const trimmedValue = value.trim();

  return (
    trimmedValue.length >= MIN_INVESTOR_NAME_LENGTH &&
    trimmedValue.length <= MAX_INVESTOR_NAME_LENGTH
  );
});

const InvestmentAmount = refine(number(), 'InvestmentAmount', (value) => {
  return (
    Number.isInteger(value) &&
    value >= MIN_INVESTOR_AMOUNT &&
    value <= MAX_INVESTOR_AMOUNT
  );
});

const InvestmentComment = refine(string(), 'InvestmentComment', (value) => {
  const trimmedValue = value.trim();
  
  return trimmedValue.length <= MAX_COMMENT_LENGTH;
});

const CreateInvestmentBody = object({
  companyId: CompanyId,
  investorName: InvestorName,
  amount: InvestmentAmount,
  comment: optional(nullable(InvestmentComment)),
  password: CreatePassword,
  passwordConfirmation: CreatePassword,
});

const PatchInvestmentBody = object({
  investmentsId: InvestmentId,
  investorName: InvestorName,
  amount: InvestmentAmount,
  comment: optional(nullable(InvestmentComment)),
  password: AuthPassword,
});

const DeleteInvestmentBody = object({
  investmentsId: InvestmentId,
  password: AuthPassword,
});

function validateCompanyIdParam(companyId) {
  const [error] = validate(companyId, CompanyId);
  
  if (error) {
    return '잘못된 요청입니다.';
  }

  return null;
}

function validateCreateInvestmentBody(body) {
  const [error] = validate(body, CreateInvestmentBody);

  if (error) {
    return '잘못된 요청입니다.';
  }

  if (body.password !== body.passwordConfirmation) {
    return '잘못된 요청입니다.';
  }

  return null;
}

function validatePatchInvestmentBody(body) {
  const [error] = validate(body, PatchInvestmentBody);
  
  if (error) {
    return '잘못된 요청입니다.';
  }

  return null;
}

function validateDeleteInvestmentBody(body) {
  const [error] = validate(body, DeleteInvestmentBody);

  if (error) {
    return '잘못된 요청입니다.';
  }

  return null;
}



export {
  validateCompanyIdParam,
  validateCreateInvestmentBody,
  validatePatchInvestmentBody,
  validateDeleteInvestmentBody
};