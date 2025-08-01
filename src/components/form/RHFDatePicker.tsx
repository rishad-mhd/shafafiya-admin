import type { Dayjs } from 'dayjs';

import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface RHFDatePickerProps {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
  [key: string]: any;
}

export default function RHFDatePicker({ name, label, helperText, ...other }: RHFDatePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          label={label}
          value={field.value || null}
          onChange={(newValue: Dayjs | null) => field.onChange(newValue)}
          slotProps={{
            textField: {
              error: !!error,
              helperText: error ? error.message : helperText,
              InputLabelProps: { shrink: Boolean(field.value) },
            },
          }}
          {...other}
        />
      )}
    />
  );
}
