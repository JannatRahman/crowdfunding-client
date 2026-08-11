'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { campaignSchema } from '@/utils/validations';
import { CAMPAIGN_CATEGORIES } from '@/utils/constants';
import { Button } from '@heroui/react';
import { FormInput, FormTextarea } from '@/components/shared/FormField';
import ImageUploader from '@/components/shared/ImageUploader';
import { formatCurrency } from '@/utils/formatters';

const CATEGORY_ICONS = {
  technology: '🔌',
  education: '📖',
  health: '❤️',
  art: '🎨',
  community: '🤝',
  environment: '🌱',
  other: '✨',
};

function SectionTitle({ step, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <span className="w-7 h-7 rounded-full bg-cf-dark text-cf-cream text-sm font-black flex items-center justify-center shrink-0 mt-0.5">
        {step}
      </span>
      <div>
        <h2 className="text-lg font-extrabold text-cf-dark tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-cf-brown font-medium mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

const inputClasses = {
  label: 'text-cf-dark font-bold text-xs uppercase tracking-wider',
  inputWrapper: 'border border-cf-tan hover:border-cf-dark/50 focus-within:!border-cf-dark rounded-xl bg-white shadow-sm transition-all duration-200',
};

export default function CampaignForm({ initialData, onSubmit, isLoading, submitText = 'Save Campaign' }) {
  const {
    control,
    handleSubmit,
    watch,
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

  const title = watch('title') || '';
  const category = watch('category') || '';
  const goalAmount = Number(watch('goalAmount')) || 0;
  const endDate = watch('endDate') || '';
  const days = endDate ? Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Main column ─────────────────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-6">
        {/* Story */}
        <section className="bg-white rounded-2xl border border-cf-tan shadow-sm p-6 md:p-8">
          <SectionTitle step={1} title="Campaign Story" subtitle="Tell people what you're building and why it matters." />
          <div className="space-y-5">
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
                  classNames={inputClasses}
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
                  classNames={inputClasses}
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
                  classNames={inputClasses}
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
                  classNames={inputClasses}
                />
              )}
            />
          </div>
        </section>

        {/* Cover image */}
        <section className="bg-white rounded-2xl border border-cf-tan shadow-sm p-6 md:p-8">
          <SectionTitle step={2} title="Cover Image" subtitle="A strong visual makes your campaign memorable." />
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={Array.isArray(field.value) ? field.value[0] || '' : field.value || ''}
                onChange={(url) => field.onChange(url ? [url] : [])}
                hint="Recommended: 1280×720 px (16:9). Max 8 MB."
                previewSize="lg"
                maxSizeMB={8}
                error={errors.images?.message}
              />
            )}
          />
        </section>
      </div>

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Funding */}
        <section className="bg-white rounded-2xl border border-cf-tan shadow-sm p-6">
          <SectionTitle step={3} title="Funding" subtitle="Set your target and timeline." />
          <div className="space-y-5">
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="text-cf-dark font-bold text-xs uppercase tracking-wider mb-2 block">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CAMPAIGN_CATEGORIES.map((c) => {
                      const selected = field.value === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => field.onChange(c.value)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 cursor-pointer select-none ${
                            selected
                              ? 'bg-cf-dark border-cf-dark text-cf-cream shadow-md scale-[1.02]'
                              : 'bg-white border-cf-tan text-cf-brown hover:border-cf-dark/50 hover:text-cf-dark'
                          }`}
                        >
                          <span>{CATEGORY_ICONS[c.value] || '✨'}</span>
                          <span className="truncate">{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.category && <p className="text-red-500 text-xs mt-2 font-semibold">{errors.category.message}</p>}
                </div>
              )}
            />

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
                  startContent={<span className="text-cf-brown font-bold">$</span>}
                  classNames={inputClasses}
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
                  classNames={inputClasses}
                />
              )}
            />
          </div>
        </section>

        {/* Live preview */}
        <section className="rounded-2xl p-6 bg-gradient-to-br from-cf-dark via-[#4A2E20] to-cf-brown text-cf-cream shadow-lg shadow-cf-brown/20">
          <h3 className="text-sm font-black uppercase tracking-wider text-cf-tan mb-4">Campaign Preview</h3>
          <p className="text-lg font-extrabold leading-snug line-clamp-2">{title || 'Your campaign title'}</p>
          <p className="text-xs text-cf-tan/90 mt-1 capitalize">{category || 'Category'}</p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-cf-tan/90 font-semibold">Goal</span>
              <span className="font-black">{goalAmount > 0 ? formatCurrency(goalAmount) : '$0'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cf-tan/90 font-semibold">Duration</span>
              <span className="font-black">{days == null ? '—' : `${days} days`}</span>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-cf-cream/20">
            <p className="text-[11px] text-cf-tan/80 font-medium leading-relaxed">
              Tip: campaigns with a clear goal and a compelling story raise significantly more funding.
            </p>
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-gradient-to-r from-cf-dark to-cf-brown hover:from-cf-brown hover:to-cf-dark text-cf-cream font-extrabold h-12 rounded-xl shadow-lg shadow-cf-brown/25 transition-all cursor-pointer select-none active:scale-[0.99]"
            size="lg"
          >
            {submitText}
          </Button>
          <p className="text-center text-xs text-cf-brown/70 font-medium">
            Your campaign will be reviewed by admins before going live.
          </p>
        </div>
      </div>
    </form>
  );
}
