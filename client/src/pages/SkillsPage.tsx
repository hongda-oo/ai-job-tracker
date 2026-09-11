import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import type { ApiError } from '@/api/client';
import { skillFormSchema, type SkillFormValues } from '@/schemas/skill';
import { useCreateSkill, useDeleteSkill, useSkills } from '@/features/skills/hooks';

export function SkillsPage() {
  const { data: skills, isLoading } = useSkills();
  const createMutation = useCreateSkill();
  const deleteMutation = useDeleteSkill();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({ resolver: zodResolver(skillFormSchema) });

  async function onSubmit(values: SkillFormValues) {
    setFormError(null);
    try {
      await createMutation.mutateAsync(values);
      reset();
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.error) {
        setFormError(err.response.data.error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-500">
          ← Dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">Skills</h1>
        <p className="mt-1 text-sm text-gray-500">
          Maintain your skill profile — used to match against job descriptions.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm"
          noValidate
        >
          <div className="flex-1">
            <TextField
              label="Skill"
              placeholder="e.g. TypeScript"
              error={errors.skill?.message}
              {...register('skill')}
            />
          </div>
          <div className="flex-1">
            <TextField
              label="Proficiency (optional)"
              placeholder="e.g. Advanced"
              error={errors.proficiency?.message}
              {...register('proficiency')}
            />
          </div>
          <div className="pt-6">
            <Button type="submit" isLoading={isSubmitting}>
              Add
            </Button>
          </div>
        </form>
        {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}

        <div className="mt-6">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading skills…</p>
          ) : skills && skills.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm shadow-sm ring-1 ring-inset ring-gray-200"
                >
                  <span className="font-medium text-gray-900">{s.skill}</span>
                  {s.proficiency && <span className="text-gray-400">· {s.proficiency}</span>}
                  <button
                    type="button"
                    aria-label={`Remove ${s.skill}`}
                    onClick={() => deleteMutation.mutate(s.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              No skills yet. Add your first one above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
