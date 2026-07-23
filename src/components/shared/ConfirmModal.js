'use client';

import { Button } from '@heroui/react';
import SimpleModal, { SimpleModalHeader, SimpleModalBody, SimpleModalFooter } from './SimpleModal';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmColor = 'danger' }) {
  return (
    <SimpleModal isOpen={isOpen} onClose={onClose} size="sm">
      <SimpleModalHeader>{title}</SimpleModalHeader>
      <SimpleModalBody>
        <p className="text-gray-600">{message}</p>
      </SimpleModalBody>
      <SimpleModalFooter>
        <Button variant="light" onPress={onClose}>Cancel</Button>
        <Button color={confirmColor} onPress={onConfirm}>{confirmText}</Button>
      </SimpleModalFooter>
    </SimpleModal>
  );
}
