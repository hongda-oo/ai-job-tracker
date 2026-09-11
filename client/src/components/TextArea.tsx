import { forwardRef, type TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const areaId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={areaId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <textarea
          ref={ref}
          id={areaId}
          rows={4}
          className={clsx(
            'rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500',
            error ? 'border-red-400' : 'border-gray-300',
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
