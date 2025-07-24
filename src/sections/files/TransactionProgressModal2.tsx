import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';

import { Box, Chip, Modal, Stack, Button, Typography, LinearProgress } from '@mui/material';

const socket = io('http://localhost:3002'); // Replace with your server URL

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function TransactionProgressModal({
  open,
  onClose,
  total,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
}) {
  const [saved, setSaved] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  const processed = saved.length + skipped.length + failed.length;
  const progress = total ? (processed / total) * 100 : 0;

  useEffect(() => {
    if (!open) return undefined;

    setSaved([]);
    setSkipped([]);
    setFailed([]);
    setIsProcessing(true);

    const handleProgress = (data: any) => {
      if (data.type === 'saved') {
        setSaved((prev) => [...prev, data.id]);
      } else if (data.type === 'skipped') {
        setSkipped((prev) => [...prev, data.id]);
      } else if (data.type === 'failed') {
        setFailed((prev) => [...prev, data.id]);
      } else if (data.type === 'completed') {
        setIsProcessing(false);
      }
    };

    socket.on('transaction-progress', handleProgress);

    return () => {
      socket.off('transaction-progress', handleProgress);
    };
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Transaction Processing
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 2 }}
          color={isProcessing ? 'primary' : 'success'}
        />

        <Typography variant="body2" gutterBottom>
          {processed} of {total} processed ({Math.round(progress)}%)
        </Typography>

        <Stack direction="row" spacing={1} my={2} flexWrap="wrap">
          <Chip label={`✅ Saved: ${saved.length}`} color="success" />
          <Chip label={`⏭️ Skipped: ${skipped.length}`} color="info" />
          <Chip label={`❌ Failed: ${failed.length}`} color="error" />
        </Stack>

        {!isProcessing && (
          <Stack direction="row" justifyContent="center">
            <Button onClick={onClose} variant="contained" color="primary">
              Close
            </Button>
          </Stack>
        )}
      </Box>
    </Modal>
  );
}
