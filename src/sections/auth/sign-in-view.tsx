import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import { Link } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from '../../context/auth.context';
import FormProvider, { RHFTextField } from '../../components/form';

// ----------------------------------------------------------------------
const SignInSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});
export function SignInView() {
  const { login } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(SignInSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSignIn = useCallback(
    async (data: any) => {
      try {
        await login(data.email, data.password);
        enqueueSnackbar('Logged in successfully', { variant: 'success' });
      } catch (err: any) {
        enqueueSnackbar(err.response?.data?.message || 'Something went wrong', {
          variant: 'error',
        });
      }
    },
    [enqueueSnackbar, login]
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleSignIn)}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        <RHFTextField
          fullWidth
          name="email"
          label="Email address"
          sx={{ mb: 3 }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        <Link
          component={RouterLink}
          to="/forgot-password"
          variant="body2"
          color="inherit"
          sx={{ mb: 1.5 }}
        >
          Forgot password?
        </Link>

        <RHFTextField
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          loading={isSubmitting}
          variant="contained"
        >
          Sign in
        </Button>
      </Box>
    </FormProvider>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Sign in</Typography>
      </Box>
      {renderForm}
    </>
  );
}
