// 공통으로 쓸 함수 모음


export function formatAmount(value) {
  const amount = Number(value);

  if (!amount) {
    return "0원";
  }

  if (amount >= 950_000_000_000) {
    return `${Math.round(amount / 1_000_000_000_000)}조원`;
  }

  if (amount >= 99_950_000_000) {
    return `${Math.round(amount / 100_000_000_000)}천억원`;
  }

  if (amount >= 95_000_000) {
    return `${Math.round(amount / 100_000_000)}억원`;
  }

  if (amount >= 9_500_000) {
    return `${Math.round(amount / 10_000_000)}천만원`;
  }

  if (amount >= 950_000) {
    return `${Math.round(amount / 1_000_000)}백만원`;
  }

  if (amount >= 9_500) {
    return `${Math.round(amount / 10_000)}만원`;
  }

  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}천원`;
  }

  return `${amount}원`;
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

// 찜한 기업 localStorage 관리
const FAVORITE_COMPANY_IDS_KEY = "favoriteCompanyIds";

// localStorage에서 찜한 기업 ID 목록을 읽는다.
export function getFavoriteCompanyIds() {

  try{
    const stored = localStorage.getItem(FAVORITE_COMPANY_IDS_KEY);

    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [];
  } catch {
    return [];
  }
}

// 찜한 기업 ID 목록을 localStorage에 저장한다.
export function saveFavoriteCompanyIds(companyIds) {

  try{
    localStorage.setItem(
      FAVORITE_COMPANY_IDS_KEY,
      JSON.stringify(companyIds)
    );
  } catch (error){
    console.error("찜한 기업 저장 실패", error);
  }
}

// 특정 기업이 찜되어 있는지 확인한다.
export function isFavoriteCompany(companyId) {
  const favoriteCompanyIds = getFavoriteCompanyIds();

  return favoriteCompanyIds.includes(companyId);
}

// 찜 추가 또는 해제 후 변경된 ID 목록을 반환한다.
export function toggleFavoriteCompany(companyId) {
  const favoriteCompanyIds = getFavoriteCompanyIds();

  let updatedFavoriteCompanyIds;

  if (favoriteCompanyIds.includes(companyId)) {
    updatedFavoriteCompanyIds = favoriteCompanyIds.filter(
      (id) => id !== companyId 
    );
  } else {
    updatedFavoriteCompanyIds = [...favoriteCompanyIds, companyId];
  }

  saveFavoriteCompanyIds(updatedFavoriteCompanyIds);
  return updatedFavoriteCompanyIds;
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