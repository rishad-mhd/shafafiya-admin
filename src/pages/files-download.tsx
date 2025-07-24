import { CONFIG } from 'src/config-global';

import DownloadFileForm from '../sections/files/download/download-files';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Files Download - ${CONFIG.appName}`}</title>

      <DownloadFileForm />
    </>
  );
}
