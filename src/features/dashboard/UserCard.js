import React from 'react';
import { useLocation } from 'react-router-dom';
// import { Link as RouterLink } from 'react-router-dom';
import HybridLink from '@app//HybridLink';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
// import Fade from '@mui/material/Fade';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import dayjs from 'dayjs';
import { USER_ROLE, CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';

const UserCard = () => {
  const location = useLocation();
  const user = useUser();
  const userRole = useRole();
  const queryParams = {
    categoryId: CENT_TRCN_DSBL_CATEGORY.CENT_ALL.id,
    dsblAcptDt: dayjs().format('YYYYMMDD'),
    dprtId: userRole === USER_ROLE.SELECTOR ? '' : user.dprtId,
    dsblPrcgPicId: user.userId,
    dsblPrsrName: user.userNm,
    dsblPrcgDt: dayjs().format('YYYYMMDD'),
    // new Date().getHours() < 4
    //   ? dayjs().subtract(1, 'day').format('YYYYMMDD')
    //   : dayjs().format('YYYYMMDD'),
  };

  return (
    <Card
      sx={{
        mt: 3,
        // background: 'linear-gradient(to right bottom, #ba68c8, #9c27b0)',
      }}
    >
      <CardHeader
        sx={{ py: 1 }}
        avatar={
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
            }}
            aria-label="employee"
          >
            {userRole.substring(0, 1)}
          </Avatar>
        }
        title={user.userId ? `${user.userId}(${user.userNm})` : '\x00'}
        subheader={userRole}
        titleTypographyProps={{
          variant: 'sutitle1',
          fontWeight: 600,
          color: 'primary',
        }}
      ></CardHeader>
      <CardContent>
        <Typography variant="body1" align="center" color="text.secondary" noWrap>
          <strong>지역: </strong>
          {user.intgAstsBzDvsNm}, <strong>부서: </strong>
          {user.dprtNm}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          aria-label="center"
          variant="contained"
          sx={{ mx: 'auto' }}
          component={HybridLink}
          to={'/centtrcndsbl?' + new URLSearchParams(queryParams).toString()}
          state={{
            from: location.pathname,
            title: '센터 단말기장애',
          }}
        >
          {userRole === USER_ROLE.SELECTOR ? '전체센터' : user.dprtNm}
        </Button>
      </CardActions>
    </Card>
  );
};

//export default React.memo(UserCard);
export default UserCard;
