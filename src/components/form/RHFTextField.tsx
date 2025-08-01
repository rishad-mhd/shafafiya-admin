// form
import { Controller, useFormContext } from 'react-hook-form';

// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

interface RHFTextFieldProps {
  name: string;
  helperText?: React.ReactNode;
  [key: string]: any; // Allow other props to be passed
}

export default function RHFTextField({ name, helperText, ...other }: RHFTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
    
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          slotProps={{inputLabel:{shrink:Boolean(field.value)}}}
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
