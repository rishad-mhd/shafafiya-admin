// form
import { Controller, useFormContext } from 'react-hook-form';

// @mui
import { Switch, FormHelperText, FormControlLabel } from '@mui/material';

// ----------------------------------------------------------------------

interface RHFSwitchProps {
  name: string;
  helperText?: string;
  label: string;
  [key: string]: any;
}

export default function RHFSwitch({ name, helperText, label, ...other }: RHFSwitchProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <FormControlLabel
            label={label}
            control={<Switch {...field} checked={field.value} />}
            {...other}
          />

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </div>
      )}
    />
  );
}
