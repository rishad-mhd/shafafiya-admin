import { useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { Navigate, useLocation } from 'react-router-dom';

import { Box, LinearProgress, linearProgressClasses } from '@mui/material';

// components
// import LoadingScreen from '../components/loading-screen';
//
import SignInPage from '../../pages/sign-in';
import { AuthLayout } from '../../layouts/auth';
import { useAuthContext } from '../../context/auth.context';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized } = useAuthContext();

  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LinearProgress
          sx={{
            width: 1,
            maxWidth: 320,
            bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
            [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
          }}
        />
      </Box>
    );
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    );
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <> {children} </>;
}
