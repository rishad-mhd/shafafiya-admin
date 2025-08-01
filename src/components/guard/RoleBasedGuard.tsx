// @mui
import { Button, Container, Typography } from '@mui/material';

import { useAuthContext } from '../../context/auth.context';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  hasContent?: boolean;
  roles?: string[];
  children: React.ReactNode;
};

export default function RoleBasedGuard({ hasContent, roles, children }: RoleBasedGuardProp) {
  // Logic here to get current user role
  const { user, logout } = useAuthContext();

  // const currentRole = 'user';
  const currentRole = user?.role; // admin;

  if (typeof roles !== 'undefined' && !roles.includes(currentRole)) {
    return hasContent ? (
      <Container
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 2,
        }}
      >
        <Typography variant="h3">Permission Denied</Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          You do not have permission to access this page
        </Typography>
        <Button variant="contained" onClick={logout}>
          Logout
        </Button>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}
