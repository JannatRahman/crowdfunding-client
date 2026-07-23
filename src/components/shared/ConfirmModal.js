'use client';

import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmColor = 'danger' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <p className="text-gray-600">{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Cancel</Button>
          <Button color={confirmColor} onPress={onConfirm}>{confirmText}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
