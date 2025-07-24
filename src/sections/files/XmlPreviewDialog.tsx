import React from 'react';
import XMLViewer from 'react-xml-viewer';

import {
  Dialog,
  Button,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { Iconify } from '../../components/iconify';

type XmlPreviewDialogProps = {
  open: boolean;
  onClose: () => void;
  xmlString: string;
};

const XmlPreviewDialog: React.FC<XmlPreviewDialogProps> = ({ open, onClose, xmlString }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      XML Preview
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </DialogTitle>

    <DialogContent dividers>
      {xmlString ? <XMLViewer xml={xmlString} /> : <p>No XML data to preview.</p>}
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose} color="primary" variant="contained">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default XmlPreviewDialog;
