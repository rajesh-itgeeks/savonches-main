// hooks/useToast.js
import { useState } from 'react';

export const useToast = () => {
  const [toastActive, setToastActive] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const showSuccess = (message) => {
    setSuccess(message);
    setError('');
    setToastActive(true);
  };

  const showError = (message) => {
    setError(message);
    setSuccess('');
    setToastActive(true);
  };

  const dismiss = () => {
    setToastActive(false);
    setSuccess('');
    setError('');
  };

  return {
    toastActive,
    success,
    error,
    setSuccess,
    setError,
    setToastActive,
    showSuccess,
    showError,
    dismiss,
  };
};
