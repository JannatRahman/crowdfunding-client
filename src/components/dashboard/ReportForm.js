'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportSchema } from '@/utils/validations';
import { useSubmitReport } from '@/hooks/useAdmin';
import { Button, TextArea } from '@heroui/react';
import { REPORT_REASONS } from '@/utils/constants';
import SimpleModal, { SimpleModalHeader, SimpleModalBody, SimpleModalFooter } from '@/components/shared/SimpleModal';

export default function ReportForm({ targetType, targetId, isOpen, onClose }) {
  const submitReport = useSubmitReport();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: { targetType, targetId, reason: '', description: '' },
  });

  const onSubmit = async (data) => {
    submitReport.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleModalHeader>Report Content</SimpleModalHeader>
        <SimpleModalBody className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Reason</label>
            <select
              {...register('reason')}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a reason</option>
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
          </div>

          <TextArea
            {...register('description')}
            label="Description (optional)"
            placeholder="Provide more details about your report"
            minRows={3}
          />
        </SimpleModalBody>
        <SimpleModalFooter>
          <Button variant="light" onPress={onClose}>Cancel</Button>
          <Button type="submit" color="danger" isLoading={submitReport.isPending}>
            Submit Report
          </Button>
        </SimpleModalFooter>
      </form>
    </SimpleModal>
  );
}
