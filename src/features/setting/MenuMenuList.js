import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Home from '@mui/icons-material/Home';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import BusAlertOutlinedIcon from '@mui/icons-material/BusAlertOutlined';
import dayjs from 'dayjs';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import { USER_ROLE, CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';
import nativeApp from '@common/utils/nativeApp';

const MenuMenuList = ({ onParentClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser();
  const userRole = useRole();

  const menus = [
    { title: 'Home', icon: <Home />, link: '/' },
    {
      title: '센터 단말기장애',
      icon: <PeopleOutlinedIcon />,
      link: '/centtrcndsbl',
    },
    { title: '단말기 장애', icon: <BusAlertOutlinedIcon />, link: '/trcndsbl' },
  ];

  const handleClick = (index) => {
    let queryParams = null;
    switch (menus[index].link) {
      case '/centtrcndsbl':
        queryParams = {
          categoryId: CENT_TRCN_DSBL_CATEGORY.CENT_ALL.id,
          dsblAcptDt: dayjs().format('YYYYMMDD'),
          dprtId: userRole === USER_ROLE.SELECTOR ? '' : user.dprtId,
          dsblPrcgPicId: user.userId,
          dsblPrsrName: user.userNm,
          dsblPrcgDt: dayjs().format('YYYYMMDD'),
        };
        break;
      case '/trcndsbl':
        queryParams = {
          dsblAcptDtDvs: '3month',
          dsblAcptSttDt: dayjs().subtract(3, 'month').format('YYYYMMDD'),
          dsblAcptEndDt: dayjs().format('YYYYMMDD'),
          dprtId: user.trcnDsblCentYn === 'Y' ? user.dprtId : '',
          dprtNm: user.trcnDsblCentYn === 'Y' ? user.dprtNm : '',
        };
        break;
      default:
        queryParams = null;
    }

    if (nativeApp.isIOS()) {
      nativeApp.navigateView(menus[index].link);
    } else {
      const isCurrentPage = location.pathname === menus[index].link;
      if (isCurrentPage) {
        onParentClose();
      }
      navigate(
        menus[index].link + (queryParams ? `?${new URLSearchParams(queryParams).toString()}` : ''),
        {
          replace: isCurrentPage,
          state: { from: isCurrentPage ? location.state?.from : location.pathname },
        }
      );
    }
  };

  return (
    <Paper sx={{ mt: 3 }}>
      <MenuList>
        <Typography variant="subtitle2" sx={{ pl: 2, mb: 1, color: 'text.secondary' }}>
          메뉴
        </Typography>
        {menus.map((menu, index) => (
          <MenuItem key={index} onClick={() => handleClick(index)}>
            <ListItemIcon>{menu.icon}</ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                color: 'text.secondary',
                fontWeight: (theme) => theme.typography.fontWeightBold,
              }}
            >
              {menu.title}
            </ListItemText>
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
};

export default React.memo(MenuMenuList);
