import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Modal } from '@/components/Modal';
import { TextField } from '@/components/TextField';
import { TextArea } from '@/components/TextArea';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import type { ApiError } from '@/api/client';
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type JobApplication,
} from '@/types/application';
import { applicationFormSchema, type ApplicationFormValues } from '@/schemas/application';
import { useCreateApplication, useUpdateApplication } from './hooks';

function toDateInputValue(iso: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

interface ApplicationFormModalProps {
  open: boolean;
  onClose: () => void;
  application?: JobApplication;
}

export function ApplicationFormModal({ open, onClose, application }: ApplicationFormModalProps) {
  const isEditing = !!application;
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: { status: 'SAVED' },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      application
        ? {
            company: application.company.name,
            title: application.title,
            jobUrl: application.jobUrl ?? '',
            location: application.location ?? '',
            salary: application.salary ?? '',
            source: application.source ?? '',
            status: application.status,
            dateApplied: toDateInputValue(application.dateApplied),
            jobDescription: application.jobDescription ?? '',
            notes: application.notes ?? '',
            recruiterName: application.recruiterName ?? '',
            recruiterEmail: application.recruiterEmail ?? '',
          }
        : { status: 'SAVED' },
    );
    setFormError(null);
  }, [open, application, reset]);

  async function onSubmit(values: ApplicationFormValues) {
    setFormError(null);
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: application.id, input: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      onClose();
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.error) {
        setFormError(err.response.data.error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit Application' : 'Add Application'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Company" error={errors.company?.message} {...register('company')} />
          <TextField label="Job title" error={errors.title?.message} {...register('title')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Job URL"
            placeholder="https://..."
            error={errors.jobUrl?.message}
            {...register('jobUrl')}
          />
          <TextField label="Location" error={errors.location?.message} {...register('location')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Status" error={errors.status?.message} {...register('status')}>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
          <TextField
            label="Date applied"
            type="date"
            error={errors.dateApplied?.message}
            {...register('dateApplied')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField label="Source" error={errors.source?.message} {...register('source')} />
          <TextField label="Salary" error={errors.salary?.message} {...register('salary')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Recruiter name"
            error={errors.recruiterName?.message}
            {...register('recruiterName')}
          />
          <TextField
            label="Recruiter email"
            type="email"
            error={errors.recruiterEmail?.message}
            {...register('recruiterEmail')}
          />
        </div>

        <TextArea
          label="Job description"
          error={errors.jobDescription?.message}
          {...register('jobDescription')}
        />
        <TextArea label="Notes" error={errors.notes?.message} {...register('notes')} />

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save changes' : 'Add application'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
