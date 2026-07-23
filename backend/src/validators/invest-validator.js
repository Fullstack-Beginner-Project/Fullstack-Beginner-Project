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
  investmentId: InvestmentId,
  investorName: InvestorName,
  amount: InvestmentAmount,
  comment: optional(nullable(InvestmentComment)),
  password: AuthPassword,
});

const DeleteInvestmentBody = object({
  investmentId: InvestmentId,
  password: AuthPassword,
});

const CREATE_FIELD_MESSAGES = {
  investorName: '투자자 이름은 2자 이상 40자 이하로 입력해주세요.',
  amount: '투자 금액은 10원 이상 100억 이하로 입력해주세요.',
  comment: '투자 코멘트는 1000자 이하로 입력해주세요.',
  password: '비밀번호는 8자 이상 32자 이하로 입력해주세요.',
  passwordConfirmation: '동일한 비밀번호를 입력해주세요.',
};

const PATCH_FIELD_MESSAGES = {
  investorName: '투자자 이름은 2자 이상 40자 이하로 입력해주세요.',
  amount: '투자 금액은 10원 이상 100억 이하로 입력해주세요.',
  comment: '투자 코멘트는 1000자 이하로 입력해주세요.',
  password: '비밀번호가 올바르지 않습니다.',
};

const DELETE_FIELD_MESSAGES = {
  password: '비밀번호가 올바르지 않습니다.',
};

function getFieldErrorMessage(error, fieldMessages) {
  return fieldMessages[error.key] || '잘못된 요청입니다.';
}

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
    return getFieldErrorMessage(error, CREATE_FIELD_MESSAGES);
  }

  if (body.password !== body.passwordConfirmation) {
    return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
  }

  return null;
}

function validatePatchInvestmentBody(body) {
  const [error] = validate(body, PatchInvestmentBody);
  
  if (error) {
    return getFieldErrorMessage(error, PATCH_FIELD_MESSAGES);
  }

  return null;
}

function validateDeleteInvestmentBody(body) {
  const [error] = validate(body, DeleteInvestmentBody);

  if (error) {
    return getFieldErrorMessage(error, DELETE_FIELD_MESSAGES);
  }

  return null;
}



export {
  validateCompanyIdParam,
  validateCreateInvestmentBody,
  validatePatchInvestmentBody,
  validateDeleteInvestmentBody
};