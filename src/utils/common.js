// 공통으로 쓸 함수 모음


export function formatAmount(value) {
  const amount = Number(value);

  if (!amount) return "0원";
  if (amount >= 100_000_000) return `${Math.round(amount / 100_000_000).toLocaleString()}억 원`;
  if (amount >= 10_000_000) return `${Math.round(amount / 10_000_000).toLocaleString()}천만 원`;
  if (amount >= 1_000_000) return `${Math.round(amount / 1_000_000).toLocaleString()}백만 원`;

  return `${amount.toLocaleString()}원`;
};

// 기업 데이터 id 통일
export function normalizeCompany(company) {
  return {
    ...company,
    id: company.id ?? company.companyId,
  };
}

// 기업 찾기
export function findCompanyById(id, ...lists) {
  return lists.flat().find(company => company.id === id);
}

// 최근 비교 세션 읽기
const LAST_COMPARE_SESSION_KEY = "lastCompareSession";
const MAX_COMPARE_COMPANY_IDS_PER_REQUEST = 5;
export function readLastCompareSession() {

  try {
    const stored = JSON.parse(localStorage.getItem(LAST_COMPARE_SESSION_KEY));

    if (!stored || typeof stored.myCompanyId !== "string") {
      return {
        myCompanyId: null,
        compareCompanyIds: [],
      };
    }

    return {
      myCompanyId: stored.myCompanyId,
      compareCompanyIds: Array.isArray(stored.compareCompanyIds)
        ? stored.compareCompanyIds.slice(0, MAX_COMPARE_COMPANY_IDS_PER_REQUEST)
        : [],
    };
  } catch {
    return {
      myCompanyId: null,
      compareCompanyIds: [],
    };
  }
}

// selected / disabled 추가
export function withSelectedFlag(list, checkedIds, excludedIdSet) {
  return list.map(company => {
    const id = company.id ?? company.companyId;

    return {
      ...company,
      id,
      selected: checkedIds.has(id),
      disabled: excludedIdSet.has(id),
    };
  });
}