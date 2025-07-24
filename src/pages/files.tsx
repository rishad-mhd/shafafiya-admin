import { useState } from 'react';

import { CONFIG } from 'src/config-global';

import { FileView } from '../sections/files/view';

// ----------------------------------------------------------------------

export default function Page() {
  const [transactions, setTransactions] = useState([] as any[]);
  return (
    <>
      <title>{`Files - ${CONFIG.appName}`}</title>

      <FileView transactions={transactions} setTransactions={setTransactions} />
    </>
  );
}
