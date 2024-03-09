import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { Link as RouterLink } from 'react-router-dom';
// import HybridLink from '@app//HybridLink';
// import Card from '@mui/material/Card';
import ShadowCard from '@components/ShadowCard';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
// import CardActions from '@mui/material/CardActions';
// import Button from '@mui/material/Button';
// import Fade from '@mui/material/Fade';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import dayjs from 'dayjs';
import { CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';
import nativeApp from '@common/utils/nativeApp';

const UserCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser();
  const userRole = useRole();
  const queryParams = {
    categoryId: user.isCenterUser()
      ? CENT_TRCN_DSBL_CATEGORY.PIC_UPRO.id
      : CENT_TRCN_DSBL_CATEGORY.CENT_ALL.id,
    dsblAcptDt: dayjs().format('YYYYMMDD'),
    dprtId: user.isCenterUser() ? user.dprtId : '',
    dsblPrcgPicId: user.isCenterUser() ? user.userId : '',
    // dsblPrsrName: user.isCenterUser() ? user.userNm : '',
    // dsblPrcgDt: dayjs().format('YYYYMMDD'),
    // new Date().getHours() < 4
    //   ? dayjs().subtract(1, 'day').format('YYYYMMDD')
    //   : dayjs().format('YYYYMMDD'),
  };

  const handleCentTrcnDsbl = () => {
    if (nativeApp.isIOS()) {
      nativeApp.pushView('/trcndsbl/centtrcndsbl?' + new URLSearchParams(queryParams).toString(), {
        title: '센터 단말기장애',
      });
    } else {
      navigate('/trcndsbl/centtrcndsbl?' + new URLSearchParams(queryParams).toString(), {
        state: { from: location.pathname },
      });
    }
  };

  return (
    <ShadowCard
      sx={{
        mt: 3,
      }}
    >
      <CardActionArea onClick={() => handleCentTrcnDsbl()}>
        <CardHeader
          avatar={
            <Avatar
              sx={{
                bgcolor: 'secondary',
                background: (theme) =>
                  `linear-gradient(to right bottom, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
              }}
              aria-label="employee"
            >
              {userRole.getFistRoleName().substring(0, 1)}
            </Avatar>
          }
          title={user.userId ? `${user.userId}(${user.userNm})` : '\x00'}
          subheader={userRole.getFistRoleName()}
          titleTypographyProps={{
            variant: 'subtitle1',
            fontWeight: (theme) => theme.typography.fontWeightBold,
            color: 'primary',
          }}
        />
        <CardContent>
          <Typography variant="body1" align="center" color="text.secondary">
            <strong>지역: </strong>
            {user.intgAstsBzDvsNm}, <strong>부서: </strong>
            {user.dprtNm}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/* <CardActions>
        <Button
          aria-label="center"
          variant="contained"
          sx={{ mx: 'auto' }}
          component={HybridLink}
          to={'/trcndsbl/centtrcndsbl'}
          size=
          state={{
            from: location.pathname,
            title: '센터 단말기장애',
          }}
        >
          {user.isCenterUser() ? user.dprtNm : '전체센터'}
        </Button>
      </CardActions> */}
    </ShadowCard>
  );
};

export default React.memo(UserCard);
// export default UserCard;
