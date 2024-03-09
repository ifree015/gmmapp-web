export const APP_NAME = 'GmmApp';

export const USER_ROLE = {
  ADMIN: { id: 'ADMIN', name: '관리자' },
  MANAGER: { id: 'MANAGER', name: '팀장' },
  CENTER: { id: 'CENTER', name: '센터장' },
  STAFF: { id: 'STAFF', name: '담당자' },
  SELECTOR: { id: 'SELECTOR', name: '조회권한자' },
  getRole(roleId) {
    return Object.values(this).find((value) => value.id === roleId);
  },
  getRoles() {
    return Object.values(this).filter((value) => typeof value !== 'function');
  },
};

export const CENT_TRCN_DSBL_CATEGORY = {
  AGN_ACPT_WAIT: { id: 'agnAcptWait', title: '배정/접수 대기', shortTitle: '배정접수' },
  CENT_ALL: { id: 'centAll', title: '센터 전체', shortTitle: '센터전체' },
  CENT_UPRO: { id: 'centUpro', title: '센터내 미처리', shortTitle: '센터미처리' },
  CENT_PRCG_FN: { id: 'centPrcgFn', title: '센터 처리완료', shortTitle: '센터완료' },
  PIC_ALL: { id: 'picAll', title: '담당자 전체', shortTitle: '전체' },
  PIC_UPRO: { id: 'picUpro', title: '담당자 미처리', shortTitle: '미처리' },
  PIC_PRCG_FN: { id: 'picPrcgFn', title: '담당자 처리완료', shortTitle: '완료' },

  getDisplayCategories() {
    return [
      this.AGN_ACPT_WAIT,
      this.CENT_UPRO,
      this.PIC_UPRO,
      this.CENT_ALL,
      this.CENT_PRCG_FN,
      this.PIC_ALL,
      this.PIC_PRCG_FN,
    ];
  },
};

export const DSBL_ACPT_DVS_CD = {
  TEL: { code: '1', name: '전화접수' },
  BS: { code: '3', name: 'B/S처리' },
  SELF: { code: '4', name: '자체처리' },
  FIELD: { code: '5', name: '현장접수' },
  SYSTEM: { code: '6', name: '시스템접수' },

  getDsblAcptDvs(dsblAcptDvsCd) {
    return Object.values(this).find((value) => value.code === dsblAcptDvsCd);
  },
};

export const INTG_TRCN_STA_CD = {
  USING: '1', // 사용중
  BAD: '3', // 불량
  TEST: '5', // 테스트
};

export const NOTIFICATION_CATEGORY = {
  ALL: { id: 'all', title: '전체' },
  ASSIGN: { id: 'assign', title: '배정' },
  NOTICE: { id: 'notice', title: '공지' },
  ETC: { id: 'etc', title: '기타' },
};

export const NTFC_CRTN_CT_VAL = {
  ASSIGN: 'assign', // 배정
  NOTICE: 'notice', // 공지
};
