import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Button, Typography } from '@mui/material';

import axios from '../../utils/axios';
import FormProvider, { RHFTextField } from '../../components/form';

interface ForgotPasswordFormInputs {
  email: string;
}

const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export function ForgotPasswordView() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const methods = useForm<ForgotPasswordFormInputs>({
    defaultValues: { email: '' },
    resolver: yupResolver(ForgotPasswordSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      const res = await axios.post('/api/v1/auth/password/forgot', { email: data.email });
      navigate('/reset-password', { state: { email: data.email } });
      enqueueSnackbar(res.data?.message || 'OTP sent to your email', { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || 'Something went wrong', { variant: 'error' });
    }
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h5" gutterBottom>
        Forgot Password
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <RHFTextField name="email" label="Email" fullWidth sx={{ mb: 3 }} />
        <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
          Send OTP
        </Button>
      </FormProvider>
    </Box>
  );
}
