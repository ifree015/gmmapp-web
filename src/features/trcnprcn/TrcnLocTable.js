import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import ShadowPaper from '@components/ShadowPaper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
// import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import nativeApp from '@common/utils/nativeApp';

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.common.white,
    fontSize: theme.typography.subtitle1.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function TrcnDashboardTable({ trcnLocs }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTrcnLoc = (prsLocId) => {
    if (nativeApp.isIOS()) {
      nativeApp.pushView(`/trcnprcn/trcnloc/${prsLocId}`, {
        title: '단말기위치 상세',
      });
    } else {
      navigate(`/trcnprcn/trcnloc/${prsLocId}`, {
        state: { from: location.pathname },
      });
    }
  };

  return (
    <TableContainer
      component={ShadowPaper}
      sx={{
        my: 3,
      }}
    >
      {/* <Typography
        sx={{
          fontWeight: (theme) => theme.typography.fontWeightBold,
          color: 'common.white',
          backgroundColor: 'info.main',
          p: 1,
        }}
        variant="subtitle1"
      >
        위치별 상세
      </Typography> */}
      <Table aria-label="trcnLoc table">
        <colgroup>
          <col style={{ width: '45%' }} />
          <col />
        </colgroup>
        <TableHead>
          <TableRow>
            <StyledTableHeadCell align="center">단말기 위치</StyledTableHeadCell>
            <StyledTableHeadCell align="center">단말기 상태</StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(trcnLocs).map(([prsLocId, trcnLoc]) => (
            <StyledTableRow key={prsLocId}>
              <TableCell component="th" scope="row" onClick={() => handleTrcnLoc(prsLocId)}>
                <strong>{trcnLoc[0].prsLocNm}</strong>
              </TableCell>
              <TableCell>
                <TrcnLocTableContent trcnLoc={trcnLoc} />
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TrcnLocTableContent({ trcnLoc }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTrcnStaCd = (params) => {
    const queryParams = params;
    if (nativeApp.isIOS()) {
      nativeApp.pushView('/trcnprcn/trcn?' + new URLSearchParams(queryParams).toString(), {
        title: '단말기',
      });
    } else {
      navigate('/trcnprcn/trcn?' + new URLSearchParams(queryParams).toString(), {
        state: { from: location.pathname },
      });
    }
  };

  return (
    <ButtonGroup orientation="vertical" fullWidth color="primary" variant="text">
      {trcnLoc.map((item, index) => (
        <Button
          key={`${item.prsLocId}-${index}`}
          sx={{ justifyContent: 'flex-start' }}
          onClick={() => handleTrcnStaCd(item)}
        >
          <strong>{item.intgTrcnStaNm}:&nbsp;</strong> {item.cnt} 건
        </Button>
      ))}
    </ButtonGroup>
  );
}
