'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { campaignSchema } from '@/utils/validations';
import { CAMPAIGN_CATEGORIES } from '@/utils/constants';
import { Button } from '@heroui/react';
import { FormInput, FormTextarea } from '@/components/shared/FormField';
import ImageUploader from '@/components/shared/ImageUploader';

export default function CampaignForm({ initialData, onSubmit, isLoading, submitText = 'Save Campaign' }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      shortDescription: '',
      category: '',
      goalAmount: '',
      endDate: '',
      rewardInfo: '',
      tags: [],
      images: [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <FormInput
            {...field}
            label="Campaign Title"
            placeholder="My Amazing Campaign"
            errorMessage={errors.title?.message}
            isInvalid={!!errors.title}
          />
        )}
      />

      {/* Campaign Cover Image */}
      <Controller
        name="images"
        control={control}
        render={({ field }) => (
          <ImageUploader
            value={Array.isArray(field.value) ? field.value[0] || '' : field.value || ''}
            onChange={(url) => field.onChange(url ? [url] : [])}
            label="Campaign Cover Image"
            hint="A great cover image helps your campaign stand out. Recommended: 1280×720 px (16:9)."
            previewSize="lg"
            maxSizeMB={8}
            error={errors.images?.message}
          />
        )}
      />

      <Controller
        name="shortDescription"
        control={control}
        render={({ field }) => (
          <FormInput
            {...field}
            label="Short Description"
            placeholder="A brief one-liner about your campaign"
            errorMessage={errors.shortDescription?.message}
            isInvalid={!!errors.shortDescription}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <FormTextarea
            {...field}
            label="Full Description"
            placeholder="Tell your story... Why should people support you?"
            minRows={6}
            errorMessage={errors.description?.message}
            isInvalid={!!errors.description}
          />
        )}
      />

      <Controller
        name="rewardInfo"
        control={control}
        render={({ field }) => (
          <FormTextarea
            {...field}
            label="Reward Info"
            placeholder="What rewards do supporters get? (e.g. T-shirt, thank-you note, etc.)"
            minRows={3}
            errorMessage={errors.rewardInfo?.message}
            isInvalid={!!errors.rewardInfo}
          />
        )}
      />

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              onChange={(e) => field.onChange(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {CAMPAIGN_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          )}
        />
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
      </div>

      <Controller
        name="goalAmount"
        control={control}
        render={({ field }) => (
          <FormInput
            value={field.value}
            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
            type="number"
            label="Funding Goal ($)"
            placeholder="10000"
            errorMessage={errors.goalAmount?.message}
            isInvalid={!!errors.goalAmount}
            startContent={<span className="text-gray-400">$</span>}
          />
        )}
      />

      <Controller
        name="endDate"
        control={control}
        render={({ field }) => (
          <FormInput
            {...field}
            type="date"
            label="End Date"
            errorMessage={errors.endDate?.message}
            isInvalid={!!errors.endDate}
          />
        )}
      />

      <div className="flex justify-end gap-3">
        <Button type="submit" color="primary" isLoading={isLoading}>
          {submitText}
        </Button>
      </div>
    </form>
  );
}
