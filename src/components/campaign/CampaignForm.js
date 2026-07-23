'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { campaignSchema } from '@/utils/validations';
import { CAMPAIGN_CATEGORIES } from '@/utils/constants';
import { Button, Input, Textarea, Select, SelectItem } from '@heroui/react';

const categoryItems = CAMPAIGN_CATEGORIES.map((c) => ({ key: c.value, label: c.label }));

export default function CampaignForm({ initialData, onSubmit, isLoading, submitText = 'Save Campaign' }) {
  const {
    register,
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
      tags: [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('title')}
        label="Campaign Title"
        placeholder="My Amazing Campaign"
        errorMessage={errors.title?.message}
        isInvalid={!!errors.title}
      />

      <Input
        {...register('shortDescription')}
        label="Short Description"
        placeholder="A brief one-liner about your campaign"
        errorMessage={errors.shortDescription?.message}
        isInvalid={!!errors.shortDescription}
      />

      <Textarea
        {...register('description')}
        label="Full Description"
        placeholder="Tell your story... Why should people support you?"
        minRows={6}
        errorMessage={errors.description?.message}
        isInvalid={!!errors.description}
      />

      <Select
        label="Category"
        placeholder="Select a category"
        defaultSelectedKeys={initialData?.category ? [initialData.category] : []}
        errorMessage={errors.category?.message}
        isInvalid={!!errors.category}
      >
        {categoryItems.map((item) => (
          <SelectItem key={item.key}>{item.label}</SelectItem>
        ))}
      </Select>

      <Input
        {...register('goalAmount', { valueAsNumber: true })}
        type="number"
        label="Funding Goal ($)"
        placeholder="10000"
        errorMessage={errors.goalAmount?.message}
        isInvalid={!!errors.goalAmount}
        startContent={<span className="text-gray-400">$</span>}
      />

      <Input
        {...register('endDate')}
        type="date"
        label="End Date"
        errorMessage={errors.endDate?.message}
        isInvalid={!!errors.endDate}
      />

      <div className="flex justify-end gap-3">
        <Button type="submit" color="primary" isLoading={isLoading}>
          {submitText}
        </Button>
      </div>
    </form>
  );
}
