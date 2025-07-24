// AdminDateRangeForm.tsx

import type { Dayjs } from 'dayjs';

import { useState } from 'react';

import { DatePicker } from '@mui/x-date-pickers';
import { Box, Stack, Button, Typography, LinearProgress } from '@mui/material';

// import { FileView } from '../view';
import axiosInstance from '../../../utils/axios';
import { DashboardContent } from '../../../layouts/dashboard';

export default function DownloadFileForm() {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleSubmit = async () => {
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
        },
      });
      console.log(response.data);
      setTransactions(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Import Files
        </Typography>
      </Box>

      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <DatePicker label="End Date" value={endDate} onChange={(date) => setEndDate(date)} />
        </Stack>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          Fetch Transactions
        </Button>

        {loading && <LinearProgress />}
      </Stack>

      {/* <FileView data={transactions} /> */}
    </DashboardContent>
  );
}
