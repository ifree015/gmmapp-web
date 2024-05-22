import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import LabelValueListItem from '@components/LabelValueListItem';
import LabelListItem from '@components/LabelListItem';
import Link from '@mui/material/Link';
import { Formik } from 'formik';
import { useMutation } from '@common/queries/query';
import { updateTrop } from '@features/baseinf/baseInfAPI';
import useCmmCode from '@common/hooks/useCmnCode';
import useAlert from '@common/hooks/useAlert';
import useConfirm from '@common/hooks/useConfirm';
import useError from '@common/hooks/useError';

const TropDetailContentTab1 = forwardRef(({ trop, onChangeStatus }, ref) => {
  const openAlert = useAlert();
  const openConfirm = useConfirm();
  const openError = useError();

  const dprtIds = useCmmCode('CENT');

  const { mutate, reset } = useMutation(updateTrop, {
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
        //enableReinitialize
        initialValues={{
          busBsfcUpdYn: true,
          dprtId: trop.dprtId ?? '',
        }}
        onSubmit={(values) => {
          (async () => {
            const confirmed = await openConfirm('교통사업자', '수정하시겠습니다?');
            if (confirmed) {
              mutate({
                tropId: trop.tropId,
                dprtId: values.dprtId,
                busBsfcUpdYn: values.busBsfcUpdYn ? 'Y' : 'N',
              });
            }
          })();
        }}
      >
        {(formik) => (
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <List aria-label="교통사업자상세 정보">
              <LabelValueListItem label="교통사업자" value={`${trop.tropNm}(${trop.tropId})`} />
              <LabelValueListItem label="약어명" value={trop.tropAbrvNm} />
              <LabelValueListItem
                label="사업자번호"
                value={trop.brn.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')}
              />
              <LabelValueListItem label="대표자성명" value={trop.rprtName} />
              <LabelValueListItem label="주소" value={trop.addr} />
              <LabelListItem label="전화번호">
                <Link href={`tel:${trop.telNo}`} sx={{ fontSize: 'body2.fontSize' }}>
                  {trop.telNo}
                </Link>
              </LabelListItem>
              <LabelValueListItem label="FAX번호" value={trop.faxNo} />
              <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <FormControl variant="standard" size="small" fullWidth>
                  <InputLabel id="dprtId-label">부서</InputLabel>
                  <Select
                    labelId="dprtId-label"
                    id="dprtId"
                    name="dprtId"
                    value={formik.values.dprtId}
                    onChange={formik.handleChange}
                    label="부서"
                  >
                    {dprtIds?.map((dprtId) => (
                      <MenuItem value={dprtId.code} key={dprtId.code}>
                        {dprtId.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  label="버스영업소 수정동기화"
                  control={
                    <Checkbox
                      size="small"
                      id="busBsfcUpdYn"
                      checked={formik.values.busBsfcUpdYn}
                      onChange={formik.handleChange}
                    />
                  }
                />
              </ListItem>
            </List>
          </Box>
        )}
      </Formik>
    </React.Fragment>
  );
});

export default TropDetailContentTab1;
