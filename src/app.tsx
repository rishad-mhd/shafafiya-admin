import 'src/global.css';

import { useEffect } from 'react';
import { SnackbarProvider } from 'notistack';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { usePathname } from 'src/routes/hooks';

import { ThemeProvider } from 'src/theme/theme-provider';

import { AuthProvider } from './context/auth.context';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  return (
    <AuthProvider>
      <SnackbarProvider>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
        </ThemeProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
