import React from 'react';
import Button from '../button/Button';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Props {
  show: boolean;
  type: AlertType;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const SweetAlert: React.FC<Props> = ({
  show,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
}) => {
  if (!show) return null;

  const borderColorMap: Record<AlertType, string> = {
    success: 'border-green-500',
    error: 'border-red-500',
    warning: 'border-yellow-500',
    info: 'border-blue-500',
  };

  const buttonColorMap: Record<AlertType, string> = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
        <div
          className={`bg-white p-6 rounded-[25px] shadow-lg max-w-sm w-full border-t-4 ${borderColorMap[type]}`}
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-900">{title}</h2>
          <p className="text-gray-700 mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button
                className={`px-4 py-2 text-white rounded-[25px] ${buttonColorMap[type]}`}
                onClick={onCancel}
              >
                {cancelText}
              </Button>
            )}
            <Button
              className={`px-2 py-2 text-white rounded-[25px] ${buttonColorMap[type]}`}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SweetAlert;
