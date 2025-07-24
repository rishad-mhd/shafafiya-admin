import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import { DatePicker } from '@mui/x-date-pickers';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Stack, Button, Select, Divider, MenuItem, InputLabel, FormControl } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import axiosInstance from '../../utils/axios';
import TransactionProgressModal from './TransactionProgressModal2';

// ----------------------------------------------------------------------
const fileTypes = [
  {
    value: '-1',
    label: 'All',
  },
  {
    value: '2',
    label: 'Claim Submission',
  },
  { value: '4', label: 'Person Register' },
  { value: '8', label: 'Remittance Advice' },
  { value: '16', label: 'Prior Request' },
  { value: '32', label: 'Prior Authorization' },
];

const insuranceCompanies = [
  {
    name: 'All',
  },
  {
    id: 'A001',
    name: 'National Health Insurance Co. - Daman - P.J.S.C.',
  },
  {
    id: 'A012',
    name: 'Orient Insurance Pjsc Abu Dhabi 1',
  },
  {
    id: 'A023',
    name: 'Saudi Arabian Insurance Company Ltd',
  },
  {
    id: 'A024',
    name: 'Oman Insurance Company Limited – Abu Dhabi',
  },
  {
    id: 'C001',
    name: 'Nas Administration Services Llc',
  },
  {
    id: 'C002',
    name: 'Arab Gulf Health Services LLC',
  },
  {
    id: 'C004',
    name: 'Mednet U.A.E Fz. L.Lc - Abu Dhabi',
  },
  {
    id: 'C005',
    name: 'Neuron L.L.C Abu Dhabi Branch',
  },
  {
    id: 'C006',
    name: 'FMC Network',
  },
  {
    id: 'C008',
    name: 'Penta Care Medical Services-Llc',
  },
  {
    id: 'C010',
    name: 'Mobility Saint Honore International - MSH',
  },
  {
    id: 'C019',
    name: 'Mednet Global Healthcare Solutions Llc',
  },
  {
    id: 'D001',
    name: 'Daman - Thiqa Program Administration',
  },
  {
    id: 'HAAD',
    name: 'Cash',
  },
];
const directions = [
  { value: -1, label: 'All' },
  {
    value: 1,
    label: 'Sent only',
  },
  {
    value: 2,
    label: 'Receive only',
  },
];
type FileTableToolbarProps = {
  numSelected: number;
  filterName: string;
  selected: string[];
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  resetTable: () => void;
};

export function FileTableToolbar({
  numSelected,
  filterName,
  selected,
  onFilterName,
  setTransactions,
  resetTable,
}: FileTableToolbarProps) {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState('-1');
  const [insuranceCompany, setInsuranceCompany] = useState<string | null>(null);
  const [direction, setDirection] = useState(-1);
  const [downloadProgress, setDownloadProgress] = useState({
    total: 0,
    processed: 0,
    saved: [] as string[],
    skipped: [] as string[],
    failed: [] as string[],
    isLoading: false,
    open: false,
  });
  const handleDownload = async () => {
    try {
      setDownloadProgress((ps) => ({ ...ps, isLoading: true, open: true }));
      const response = await axiosInstance.post('/api/v1/transaction/download', {
        transactionIds: selected,
      });
      const updatedTransactions = response.data.updatedTransactions;

      setDownloadProgress((ps) => ({
        ...ps,
        total: numSelected,
        saved: response.data.saved,
        skipped: response.data.skipped,
        failed: response.data.failed,
        isLoading: false,
      }));

      // setTransactions((ps) => {
      //   updatedTransactions.forEach((updatedTransaction: any) => {
      //     const index = ps.findIndex(
      //       (transaction) => transaction.FileID === updatedTransaction.FileID
      //     );
      //     if (index !== -1) {
      //       ps[index] = { ...updatedTransaction, id: updatedTransaction.FileID };
      //       console.log(ps[index]);
      //     }
      //   });

      //   return [...ps];
      // });
    } catch (e) {
      console.log(e);
    }
  };
  const handleSubmit = async () => {
    resetTable();
    if (!startDate || !endDate) {
      alert('Please select both dates.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.get('/api/v1/transaction', {
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          transactionID: fileType,
          ePartner: insuranceCompany,
          direction,
        },
      });
      setTransactions(
        response.data.transactions?.map((obj: any) => ({ ...obj, id: obj.FileID })) ?? []
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toolbar
        sx={{
          p: (theme) => theme.spacing(0, 1, 0, 3),
          ...(numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        <Stack spacing={2} p={1} pt={3} flex={1}>
          <Stack direction="row" alignItems='center' width="100%" gap={2} flexWrap="wrap">
            <DatePicker
              label="Start Date"
              value={startDate}
              format="DD/MM/YYYY"
              maxDate={dayjs(endDate)}
              onChange={(date) => setStartDate(date)}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              format="DD/MM/YYYY"
              maxDate={dayjs()}
              onChange={(date) => setEndDate(date)}
            />
            <FormControl sx={{ width: 200 }}>
              <InputLabel id="demo-simple-select-label">File Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fileType}
                label="File Type"
                onChange={(e) => setFileType(e.target.value)}
              >
                {fileTypes.map((option) => (
                  <MenuItem value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: 200 }}>
              <InputLabel id="demo-simple-select-label">Insurance Company</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={insuranceCompany}
                label="Insurance Company"
                onChange={(e) => setInsuranceCompany(e.target.value)}
              >
                {insuranceCompanies.map((option) => (
                  <MenuItem value={option.id}>{option.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: 200 }}>
              <InputLabel id="demo-simple-select-label">Direction</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={direction}
                label="Direction"
                onChange={(e) => setDirection(Number(e.target.value))}
              >
                {directions.map((option) => (
                  <MenuItem value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              loading={loading}
            >
              Fetch Transactions
            </Button>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            {numSelected > 0 ? (
              <Typography component="div" variant="subtitle1">
                {numSelected} selected
              </Typography>
            ) : (
              <OutlinedInput
                fullWidth
                value={filterName}
                onChange={onFilterName}
                placeholder="Search file..."
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                }
                sx={{ maxWidth: 320 }}
              />
            )}

            {
              numSelected > 0 ? (
                <Tooltip title="Download">
                  <IconButton onClick={handleDownload}>
                    <Iconify icon="material-symbols:download-rounded" />
                  </IconButton>
                </Tooltip>
              ) : null
              // <Tooltip title="Filter list">
              //   <IconButton>
              //     <Iconify icon="ic:round-filter-list" />
              //   </IconButton>
              // </Tooltip>
            }
          </Stack>
        </Stack>
      </Toolbar>

      <TransactionProgressModal
        // isProcessing={downloadProgress.isLoading}
        // saved={downloadProgress.saved}
        // skipped={downloadProgress.skipped}
        // failed={downloadProgress.failed}
        open={downloadProgress.open}
        onClose={() => {
          setDownloadProgress({
            total: 0,
            processed: 0,
            saved: [] as string[],
            skipped: [] as string[],
            failed: [] as string[],
            isLoading: false,
            open: false,
          });
          handleSubmit();
        }}
        total={selected.length}
      />
    </>
  );
}
