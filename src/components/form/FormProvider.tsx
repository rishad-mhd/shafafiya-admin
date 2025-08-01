import type { ReactNode } from 'react';
// form
import type { UseFormReturn } from 'react-hook-form';

import { FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------

interface FormProviderProps {
  children: ReactNode;
  onSubmit?: (data: any, event?: React.BaseSyntheticEvent) => unknown | Promise<unknown>;
  methods: UseFormReturn<any>;
}

export default function FormProvider({ children, onSubmit, methods }: FormProviderProps) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
