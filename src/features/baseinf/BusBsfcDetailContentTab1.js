import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
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
import { updateBusBsfc } from '@features/baseinf/baseInfAPI';
import useCmmCode from '@common/hooks/useCmnCode';
import useAlert from '@common/hooks/useAlert';
import useConfirm from '@common/hooks/useConfirm';
import useError from '@common/hooks/useError';

const BusBsfcDetailContentTab1 = forwardRef(({ busBsfc, onChangeStatus }, ref) => {
  const openAlert = useAlert();
  const openConfirm = useConfirm();
  const openError = useError();

  const dprtIds = useCmmCode('CENT');

  const { mutate, reset } = useMutation(updateBusBsfc, {
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
          dprtId: busBsfc.dprtId ?? '',
        }}
        onSubmit={(values) => {
          (async () => {
            const confirmed = await openConfirm('버스영업소', '수정하시겠습니다?');
            if (confirmed) {
              mutate({
                tropId: busBsfc.tropId,
                busBsfcId: busBsfc.busBsfcId,
                dprtId: values.dprtId,
              });
            }
          })();
        }}
      >
        {(formik) => (
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <List aria-label="버스영업소상세 정보">
              <LabelValueListItem
                label="교통사업자"
                value={`${busBsfc.tropNm}(${busBsfc.tropId})`}
              />
              <LabelValueListItem
                label="버스영업소"
                value={`${busBsfc.bsfcNm}(${busBsfc.busBsfcId})`}
              />
              <LabelValueListItem
                label="본사/지사"
                value={busBsfc.hqYn === 'Y' ? '본사' : '지사'}
              />
              <LabelValueListItem label="주소" value={busBsfc.addr} />
              <LabelListItem label="전화번호">
                <Link href={`tel:${busBsfc.telNo}`} sx={{ fontSize: 'body2.fontSize' }}>
                  {busBsfc.telNo}
                </Link>
              </LabelListItem>
              <LabelValueListItem label="FAX번호" value={busBsfc.faxNo} />
              <ListItem>
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
              </ListItem>
            </List>
          </Box>
        )}
      </Formik>
    </React.Fragment>
  );
});

export default BusBsfcDetailContentTab1;
