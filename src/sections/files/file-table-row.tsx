import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import XmlPreviewDialog from './XmlPreviewDialog';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  name: string;
  role: string;
  status: string;
  company: string;
  avatarUrl: string;
  isVerified: boolean;
};

type FileTableRowProps = {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
};

export function FileTableRow({ row, selected, onSelectRow }: FileTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {row.FileName}
          </Box>
        </TableCell>

        <TableCell>{row.SenderID}</TableCell>

        <TableCell>{row.ReceiverID}</TableCell>
        <TableCell>{row.TransactionDate}</TableCell>

        {/* <TableCell align="center">
          {row.isVerified ? (
            <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          ) : (
            '-'
          )}
        </TableCell> */}

        {/* <TableCell>
          <Label color={(row.status === 'banned' && 'error') || 'success'}>{row.status}</Label>
        </TableCell> */}
        <TableCell>
          <Label color={row.isSaved ? 'success' : 'error'}>
            {row.isSaved ? 'Saved' : 'Not Saved'}
          </Label>
        </TableCell>
        <TableCell>
          {row.isSaved ? <Button onClick={() => setOpenModal(true)}>Preview XML</Button> : null}
        </TableCell>

        {/* <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
      <XmlPreviewDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        xmlString={row.xmlString}
      />
    </>
  );
}
