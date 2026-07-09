const COMPANY_ID_REGEX = /^[a-z0-9]{6}$/;
const PASSWORD_REGEX = /^[A-Za-z0-9!@#$%^&*_+\-=,]+$/;

const MIN_INVESTOR_NAME_LENGTH = 2;
const MAX_INVESTOR_NAME_LENGTH = 40;

const MIN_INVESTOR_AMOUNT = 10;
const MAX_INVESTOR_AMOUNT = 10000000000;

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 32;

const MAX_COMMENT_LENGTH = 1000;



export function validateCompanyIdParam(companyId){
  if (typeof companyId !== 'string' || !COMPANY_ID_REGEX.test(companyId)) {
    return '기업 ID 형식이 올바르지 않습니다.'; 
  }

  return null;
}

export function validateCreateInvestmentBody(body) {
  const {
    investorName,
    amount,
    comment,
    password,
    passwordConfirm,
  } = body;

  if (typeof investorName !== 'string') {
    return '투자자 이름을 입력해주세요.';
  }

  const trimmedInvestorName = investorName.trim();

  if (
    trimmedInvestorName.length < MIN_INVESTOR_NAME_LENGTH ||
    trimmedInvestorName.length > MAX_INVESTOR_NAME_LENGTH 
  ) {
    return '투자자 이름은 2자 이상 40자 이하로 입력해주세요.';
  }

  if (typeof amount !== 'number' || !Number.isInteger(amount)) {
    return '투자 금액은 숫자로 입력해주세요.';
  }

  if (amount < MIN_INVESTOR_AMOUNT || amount > MAX_INVESTOR_AMOUNT) {
    return '투자 금액은 10원 이상 100억 이하로 입력해주세요.';
  }

  if (comment !== undefined && comment !== null) {
    if (typeof comment !== 'string') {
      return '투자 코멘트는 문자열이어야 합니다.';
    }

  if (comment.trim().length > MAX_COMMENT_LENGTH) {
    return '투자 코멘트는 1000자 이하로 입력해주세요.';
    }
  }

  if (typeof password !== 'string') {
    return '비밀번호를 입력해주세요';
  }

  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH 
  ) {
    return '비밀번호는 8자 이상 32자 이하로 입력해주세요.';
  }

  if (!PASSWORD_REGEX.test(password)) {
    return '비밀번호에 허용되지 않은 문자가 포함되어 있습니다.';
  }

  if (password !== passwordConfirm) {
    return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
  }

  return null;
}