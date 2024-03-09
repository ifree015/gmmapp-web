import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import LabelValueListItem from '@components/LabelValueListItem';
import { Formik } from 'formik';
import { useMutation } from '@common/queries/query';
import { updateVhcl } from '@features/baseinf/baseInfAPI';
import useAlert from '@common/hooks/useAlert';
import useConfirm from '@common/hooks/useConfirm';
import useError from '@common/hooks/useError';

const VhclDetailContentTab1 = forwardRef(({ vhcl, onChangeStatus }, ref) => {
  const openAlert = useAlert();
  const openConfirm = useConfirm();
  const openError = useError();

  const { mutate, reset } = useMutation(updateVhcl, {
    onMutate: () => {
      onChangeStatus('loading');
    },
    onError: (err) => {
      onChangeStatus('idle');
      openError(err, reset);
    },
    onSuccess: (data) => {
      onChangeStatus('idle');
      openAlert(data.message);
    },
  });

  return (
    <React.Fragment>
      <Formik
        innerRef={ref}
        enableReinitialize
        initialValues={{
          unslMttr: vhcl.unslMttr ?? '',
        }}
        onSubmit={(values) => {
          (async () => {
            const confirmed = await openConfirm('차량', '수정하시겠습니다?');
            if (confirmed) {
              mutate({
                tropId: vhcl.tropId,
                vhclId: vhcl.vhclId,
                unslMttr: values.unslMttr,
              });
            }
          })();
        }}
      >
        {(formik) => (
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <List aria-label="차량상세 정보">
              <LabelValueListItem label="교통사업자" value={`${vhcl.tropNm}(${vhcl.tropId})`} />
              <LabelValueListItem label="버스영업소" value={`${vhcl.bsfcNm}(${vhcl.busBsfcId})`} />
              <LabelValueListItem label="차량번호" value={`${vhcl.vhclNo}(${vhcl.vhclId})`} />
              <LabelValueListItem label="표준차량ID" value={vhcl.stndVhclId} />
              <LabelValueListItem label="차량유형" value={vhcl.vhclTypNm} />
              <LabelValueListItem label="GPS설치위치" value={vhcl.gpsStpLocTypNm} />
              <LabelValueListItem
                label="예비차량여부"
                value={vhcl.rsrvVhclYn === 'Y' ? '예비차량' : '일반차량'}
              />
              <LabelValueListItem
                label="단말기"
                value={vhcl.rcvIntgTrcnId ? `${vhcl.rcvIntgTrcnId}(${vhcl.trcnDvsNm})` : ''}
              />
              <ListItem>
                <TextField
                  label="특이사항"
                  multiline
                  size="small"
                  rows={2}
                  fullWidth
                  id="unslMttr"
                  value={formik.values.unslMttr}
                  onChange={formik.handleChange}
                />
              </ListItem>
            </List>
          </Box>
        )}
      </Formik>
    </React.Fragment>
  );
});

export default VhclDetailContentTab1;
