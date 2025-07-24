import React from 'react';

import { Box, Chip, Modal, Stack, Button, Typography, LinearProgress } from '@mui/material';

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
  saved = [],
  skipped = [],
  failed = [],
  isProcessing,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  saved: string[];
  skipped: string[];
  failed: string[];
  isProcessing: boolean;
}) {
  const processed = saved.length + skipped.length + failed.length;
  const progress = total ? (processed / total) * 100 : 0;

  return (
    <Modal open={open}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Transaction Processing
        </Typography>

        <LinearProgress
          variant={isProcessing ? 'determinate' : 'determinate'}
          value={progress}
          sx={{ mb: 2 }}
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
