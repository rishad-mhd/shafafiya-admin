import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

import axios from '../../utils/axios';
import FormProvider, { RHFTextField } from '../../components/form';

interface ResetPasswordFormInputs {
  // email: string;
  otp: string;
  password: string;
}

const ResetPasswordSchema = yup.object().shape({
  // email: yup.string().email('Invalid email').required('Email is required'),
  otp: yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('New password is required'),
});

export function ResetPasswordView() {
  const { enqueueSnackbar } = useSnackbar();
  const { email } = useLocation().state as { email: string };
  const navigate = useNavigate();

  const methods = useForm<ResetPasswordFormInputs>({
    defaultValues: {
      // email: '',
      otp: '',
      password: '',
    },
    resolver: yupResolver(ResetPasswordSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    try {
      const response = await axios.post('/api/v1/auth/otp/verify', { email, otp: data.otp });
      const res = await axios.post('/api/v1/auth/password/reset', {
        resetToken: response.data.resetToken,
        password: data.password,
      });
      navigate('/', { replace: true });
      enqueueSnackbar(res.data?.message || 'Password reset successful', { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || 'Something went wrong', { variant: 'error' });
    }
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h5" gutterBottom>
        Reset Password
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {/* <RHFTextField name="email" label="Email" fullWidth sx={{ mb: 2 }} /> */}
        <RHFTextField name="otp" label="OTP" fullWidth sx={{ mb: 2 }} />
        <RHFTextField
          name="password"
          label="New Password"
          type="password"
          fullWidth
          sx={{ mb: 3 }}
        />
        <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
          Reset Password
        </Button>
      </FormProvider>
    </Box>
  );
}
