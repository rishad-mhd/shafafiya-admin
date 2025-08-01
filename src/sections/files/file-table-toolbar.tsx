import dayjs from 'dayjs';
import * as yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Stack, Button, Divider, MenuItem } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import axiosInstance from '../../utils/axios';
import RHFDatePicker from '../../components/form/RHFDatePicker';
import FormProvider, { RHFSelect } from '../../components/form';
import TransactionProgressModal from './TransactionProgressModal2';

const fileTypes = [
  { value: '-1', label: 'All' },
  { value: '2', label: 'Claim Submission' },
  { value: '4', label: 'Person Register' },
  { value: '8', label: 'Remittance Advice' },
  { value: '16', label: 'Prior Request' },
  { value: '32', label: 'Prior Authorization' },
];

const insuranceCompanies = [
  { name: 'All' },
  { id: 'A001', name: 'National Health Insurance Co. - Daman - P.J.S.C.' },
  { id: 'A012', name: 'Orient Insurance Pjsc Abu Dhabi 1' },
  { id: 'A023', name: 'Saudi Arabian Insurance Company Ltd' },
  { id: 'A024', name: 'Oman Insurance Company Limited – Abu Dhabi' },
  { id: 'C001', name: 'Nas Administration Services Llc' },
  { id: 'C002', name: 'Arab Gulf Health Services LLC' },
  { id: 'C004', name: 'Mednet U.A.E Fz. L.Lc - Abu Dhabi' },
  { id: 'C005', name: 'Neuron L.L.C Abu Dhabi Branch' },
  { id: 'C006', name: 'FMC Network' },
  { id: 'C008', name: 'Penta Care Medical Services-Llc' },
  { id: 'C010', name: 'Mobility Saint Honore International - MSH' },
  { id: 'C019', name: 'Mednet Global Healthcare Solutions Llc' },
  { id: 'D001', name: 'Daman - Thiqa Program Administration' },
  { id: 'HAAD', name: 'Cash' },
];

const directions = [
  { value: -1, label: 'All' },
  { value: 1, label: 'Sent only' },
  { value: 2, label: 'Receive only' },
];

const schema = yup.object().shape({
  startDate: yup.date().required('Start date is required'),
  endDate: yup
    .date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date must be after start date')
    .test('max-100-days', 'Date range cannot exceed 100 days', function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return dayjs(value).diff(dayjs(startDate), 'day') <= 100;
    }),
  fileType: yup.string().required(),
  insuranceCompany: yup.string().nullable(),
  direction: yup.number().required(),
});

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
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({
    total: 0,
    processed: 0,
    saved: [] as string[],
    skipped: [] as string[],
    failed: [] as string[],
    isLoading: false,
    open: false,
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      fileType: '-1',
      insuranceCompany: null,
      direction: -1,
    },
  });
  const { handleSubmit } = methods;
  const onFormSubmit = async (data: any) => {
    resetTable();
    setLoading(true);

    try {
      const response = await axiosInstance.get('/api/v1/transaction', {
        params: {
          startDate: dayjs(data.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(data.endDate).format('YYYY-MM-DD'),
          transactionID: data.fileType,
          ePartner: data.insuranceCompany,
          direction: data.direction,
        },
      });
      setTransactions(
        response.data.transactions?.map((obj: any) => ({ ...obj, id: obj.FileID })) ?? []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloadProgress((ps) => ({ ...ps, isLoading: true, open: true }));
      const response = await axiosInstance.post('/api/v1/transaction/download', {
        transactionIds: selected,
      });
      setDownloadProgress((ps) => ({
        ...ps,
        total: numSelected,
        saved: response.data.saved,
        skipped: response.data.skipped,
        failed: response.data.failed,
        isLoading: false,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Toolbar
        sx={{
          p: (theme) => theme.spacing(0, 1, 0, 3),
          ...(numSelected > 0 && { color: 'primary.main', bgcolor: 'primary.lighter' }),
        }}
      >
        <Stack spacing={2} p={1} pt={3} flex={1}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onFormSubmit)}>
            <Stack direction="row" alignItems="center" width="100%" gap={2} flexWrap="wrap">
              <RHFDatePicker name="startDate" label="Start Date" type="date" format="DD/MM/YYYY" />
              <RHFDatePicker name="endDate" label="End Date" type="date" format="DD/MM/YYYY" />
              <RHFSelect name="fileType" label="File Type" sx={{ width: 200 }}>
                {fileTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="insuranceCompany" label="Insurance Company" sx={{ width: 200 }}>
                {insuranceCompanies.map((option) => (
                  <MenuItem key={option.id ?? option.name} value={option.id ?? undefined}>
                    {option.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="direction" label="Direction" sx={{ width: 200 }}>
                {directions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onFormSubmit)}
                disabled={loading}
              >
                Fetch Transactions
              </Button>
            </Stack>
          </FormProvider>
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
            {numSelected > 0 && (
              <Tooltip title="Download">
                <IconButton onClick={handleDownload}>
                  <Iconify icon="material-symbols:download-rounded" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Toolbar>
      <TransactionProgressModal
        open={downloadProgress.open}
        onClose={() => {
          setDownloadProgress({
            total: 0,
            processed: 0,
            saved: [],
            skipped: [],
            failed: [],
            isLoading: false,
            open: false,
          });
          handleSubmit(onFormSubmit)();
        }}
        total={selected.length}
      />
    </>
  );
}
