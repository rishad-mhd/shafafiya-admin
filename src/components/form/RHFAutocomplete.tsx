// form
import { Controller, useFormContext } from 'react-hook-form';

// @mui
import { TextField, Autocomplete } from '@mui/material';

// ----------------------------------------------------------------------

interface RHFAutocompleteProps {
  name: string;
  label: string;
  helperText?: React.ReactNode;
  options: any[];
  [key: string]: any; // Allow other props to be passed
}

export default function RHFAutocomplete({
  name,
  label,
  helperText,
  options,
  ...other
}: RHFAutocompleteProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          options={options}
          {...field}
          onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          renderInput={(params) => (
            <TextField
              label={label}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...params}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
