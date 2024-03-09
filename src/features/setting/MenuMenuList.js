import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import Paper from '@mui/material/Paper';
import ShadowPaper from '@components/ShadowPaper';
import MenuList from '@mui/material/MenuList';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BusAlertOutlinedIcon from '@mui/icons-material/BusAlertOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import EmojiTransportationOutlinedIcon from '@mui/icons-material/EmojiTransportationOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import DoorBackOutlinedIcon from '@mui/icons-material/DoorBackOutlined';
import dayjs from 'dayjs';
import useUser from '@common/hooks/useUser';
import { CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';
import nativeApp from '@common/utils/nativeApp';

const MenuMenuList = ({ onParentClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser();

  const menuLists = [
    {
      title: '메인 메뉴',
      menuItems: [
        {
          title: '차량',
          icon: <DirectionsBusFilledOutlinedIcon color="secondary" />,
          link: '/baseinf/vhcl',
        },
        {
          title: '단말기 위치',
          icon: <DashboardOutlinedIcon color="secondary" />,
          link: '/trcnprcn/trcnloc',
        },
        { title: 'Home', icon: <HomeOutlinedIcon color="secondary" />, link: '/' },
        {
          title: '단말기 장애',
          icon: <BusAlertOutlinedIcon color="secondary" />,
          link: '/trcndsbl/trcndsbl',
        },
        {
          title: '단말기장애 승인',
          icon: <FactCheckOutlinedIcon color="secondary" />,
          link: '/wrkflw/trcndsblaprv',
        },
      ],
    },
    {
      title: '기초 정보',
      menuItems: [
        {
          title: '교통사업자',
          icon: <BusinessOutlinedIcon color="warning" />,
          link: '/baseinf/trop',
        },
        {
          title: '버스영업소',
          icon: <EmojiTransportationOutlinedIcon color="warning" />,
          link: '/baseinf/busbsfc',
        },
        {
          title: '차량',
          icon: <DirectionsBusFilledOutlinedIcon color="warning" />,
          link: '/baseinf/vhcl',
        },
      ],
    },
    {
      title: '단말기 현황',
      menuItems: [
        {
          title: '단말기 위치',
          icon: <DashboardOutlinedIcon color="warning" />,
          link: '/trcnprcn/trcnloc',
        },
        {
          title: '단말기',
          icon: <CreditCardOutlinedIcon color="warning" />,
          link: '/trcnprcn/trcn',
        },
      ],
    },
    {
      title: '단말기 장애',
      menuItems: [
        {
          title: '센터 단말기장애',
          icon: <PeopleOutlinedIcon color="info" />,
          link: '/trcndsbl/centtrcndsbl',
        },
        {
          title: '단말기 장애',
          icon: <BusAlertOutlinedIcon color="info" />,
          link: '/trcndsbl/trcndsbl',
        },
        {
          title: '중복 단말기장애',
          icon: <EventRepeatOutlinedIcon color="info" />,
          link: '/trcndsbl/dplctrcndsbl',
        },
      ],
    },
    {
      title: '단말기 모니터링',
      menuItems: [
        {
          title: '타코개폐 발생',
          icon: <DoorBackOutlinedIcon color="info" />,
          link: '/trcnmntg/tchmopgtocrn',
        },
      ],
    },
    {
      title: '워크플로우',
      menuItems: [
        {
          title: '단말기장애 승인',
          icon: <FactCheckOutlinedIcon color="info" />,
          link: '/wrkflw/trcndsblaprv',
        },
      ],
    },
  ];

  const handleClick = (index, itemIndex) => {
    let queryParams = null;
    const menuItem = menuLists[index].menuItems[itemIndex];
    switch (menuItem.link) {
      case '/trcndsbl/centtrcndsbl':
        queryParams = {
          categoryId: CENT_TRCN_DSBL_CATEGORY.CENT_ALL.id,
          dsblAcptDt: dayjs().format('YYYYMMDD'),
          dprtId: user.isCenterUser() ? user.dprtId : '',
          dsblPrcgPicId: user.isCenterUser() ? user.userId : '',
          dsblPrsrName: user.isCenterUser() ? user.userNm : '',
          dsblPrcgDt: dayjs().format('YYYYMMDD'),
        };
        break;
      case '/trcndsbl':
        // queryParams = {
        //   dsblAcptDtDvs: '3month',
        //   dsblAcptSttDt: dayjs().subtract(3, 'month').format('YYYYMMDD'),
        //   dsblAcptEndDt: dayjs().format('YYYYMMDD'),
        //   dprtId: user.isCenterUser() ? user.dprtId : '',
        //   dprtNm: user.isCenterUser() ? user.dprtNm : '',
        // };
        break;
      default:
        queryParams = null;
    }

    if (nativeApp.isIOS()) {
      nativeApp.navigateView(menuItem.link, { title: menuItem.title, goBack: true });
    } else {
      const isCurrentPage = location.pathname === menuItem.link;
      if (isCurrentPage) {
        onParentClose();
      }
      navigate(
        menuItem.link + (queryParams ? `?${new URLSearchParams(queryParams).toString()}` : ''),
        {
          replace: isCurrentPage,
          state: { from: isCurrentPage ? location.state?.from : location.pathname },
        }
      );
    }
  };

  return (
    <ShadowPaper sx={{ mt: 3 }}>
      {menuLists.map((menuList, index) => (
        <MenuList key={index}>
          {index > 0 ? <Divider sx={{ mb: 2 }} variant="middle" /> : null}
          <Typography variant="subtitle2" sx={{ pl: 2, color: 'text.secondary' }}>
            {menuList.title}
          </Typography>
          {menuList.menuItems.map((menuItem, itemIndex) => (
            <MenuItem key={`${index}-${itemIndex}`} onClick={() => handleClick(index, itemIndex)}>
              <ListItemIcon>{menuItem.icon}</ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  color: 'text.secondary',
                  fontWeight: (theme) => theme.typography.fontWeightBold,
                }}
              >
                {menuItem.title}
              </ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      ))}
    </ShadowPaper>
  );
};

export default React.memo(MenuMenuList);
