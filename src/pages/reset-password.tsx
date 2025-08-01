import { CONFIG } from 'src/config-global';

import { ResetPasswordView } from '../sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Reset Password - ${CONFIG.appName}`}</title>

      <ResetPasswordView />
    </>
  );
}
