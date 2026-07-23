'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportSchema } from '@/utils/validations';
import { useSubmitReport } from '@/hooks/useAdmin';
import { Button, Textarea, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { REPORT_REASONS } from '@/utils/constants';
import { useState } from 'react';

const reasonItems = REPORT_REASONS.map((r) => ({ key: r.value, label: r.label }));

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Report Content</ModalHeader>
          <ModalBody className="space-y-4">
            <Select
              label="Reason"
              placeholder="Select a reason"
              errorMessage={errors.reason?.message}
              isInvalid={!!errors.reason}
              defaultSelectedKeys={[]}
            >
              {reasonItems.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>

            <Textarea
              {...register('description')}
              label="Description (optional)"
              placeholder="Provide more details about your report"
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Cancel</Button>
            <Button type="submit" color="danger" isLoading={submitReport.isPending}>
              Submit Report
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
