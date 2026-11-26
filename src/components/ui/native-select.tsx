import { ChevronDownIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { fieldControl } from './input';

/** shadcn/ui NativeSelect: the browser's own select, styled. */
function NativeSelect({ className, ...props }: ComponentProps<'select'>) {
  return (
    <div data-slot="native-select-wrapper" className="relative w-full">
      <select
        data-slot="native-select"
        className={cn(fieldControl, 'appearance-none pr-10', className)}
        {...props}
      />
      <ChevronDownIcon
        aria-hidden
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
      />
    </div>
  );
}

function NativeSelectOption(props: ComponentProps<'option'>) {
  return <option data-slot="native-select-option" {...props} />;
}

export { NativeSelect, NativeSelectOption };
