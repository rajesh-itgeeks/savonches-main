// components/common/ToastMessage.jsx
import React from 'react';
import { Toast } from '@shopify/polaris';

const ToastMessage = ({ active, content, error = false, onDismiss }) => {
  if (!active || !content) return null;

  return (
    <Toast
      content={content}
      error={error}
      onDismiss={onDismiss}
    />
  );
};

export default ToastMessage;
