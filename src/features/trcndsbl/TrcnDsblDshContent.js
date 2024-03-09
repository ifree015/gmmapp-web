import Stack from '@mui/material/Stack';
// import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import dayjs from 'dayjs';
import { useQuery } from '@common/queries/query';
import useUser from '@common/hooks/useUser';
import { fetchTrcnDsblNcnt } from '@features/trcndsbl/trcnDsblAPI';
import TrcnDsblDshCentCards from './TrcnDsblDshCentCards';
import TrcnDsblDshCards from './TrcnDsblDshCards';
import TrcnDsblDshDplcList from './TrcnDsblDshDplcList';

export default function TrcnDsblDshContent() {
  const user = useUser();

  const queryParams = {
    dsblAcptDt: dayjs().format('YYYYMMDD'),
    dprtId: user.isCenterUser() ? user.dprtId : '',
    dsblPrcgPicId: user.userId,
  };

  const { data } = useQuery(['fetchTrcnDsblNcnt'], () => fetchTrcnDsblNcnt(queryParams), {
    select: ({ data }) => {
      return data;
    },
  });

  return (
    // <Slide direction="up" in>
    <Fade in>
      <Stack sx={{ my: 2 }} spacing={2}>
        <TrcnDsblDshCentCards />
        <TrcnDsblDshCards trcnDsbl={data} />
        <TrcnDsblDshDplcList />
      </Stack>
    </Fade>
    // </Slide>
  );
}
