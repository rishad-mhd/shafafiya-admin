import { Box } from '@mui/material';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Dashboard - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
      />
      <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      <Box
        component="iframe"
        title="123"
        width="100%"
        height={{
          xs: 'calc(100vh - var(--layout-header-mobile-height))',
          md: 'calc(100vh - var(--layout-header-desktop-height))',
        }}
        src="https://app.powerbi.com/reportEmbed?reportId=db819b20-adc8-4caa-b1ae-3598f795b5ea&autoAuth=true&ctid=b5f6de7b-1e43-4498-9521-e1cad9675b79"
        frameBorder="0"
        allowFullScreen
      />
      {/* <DashboardView /> */}
    </>
  );
}
