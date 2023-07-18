export const APP_NAME = 'GmmApp';

export const CENT_TRCN_DSBL_CATEGORY = {
  CENT_ALL: { id: 'centAll', title: '센터 전체', shortTitle: '전체' },
  CENT_UPRO: { id: 'centUpro', title: '센터내 미처리', shortTitle: '센터미처리' },
  UPRO: { id: 'upro', title: '미처리', shortTitle: '미처리' },
  PRCG_FN: { id: 'prcgFn', title: '처리 완료', shortTitle: '완료' },
};

export const USER_ROLE = {
  MANAGER: '센터장',
  STAFF: '담당자',
  SELECTOR: '조회권한자',
};

export const DSBL_ACPT_DVS_CD = {
  TEL: '1', // 전화접수
  SYSTEM: '6', // 시스템접수
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
