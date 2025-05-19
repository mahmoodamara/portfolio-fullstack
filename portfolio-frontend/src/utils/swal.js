import Swal from 'sweetalert2';

const baseOptions = {
  background: '#1f2937', // dark background
  color: '#e5e7eb',      // light text
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
  customClass: {
    popup: 'rounded-xl shadow-lg',
  },
};

// ✅ Success
export const showSuccessAlert = (title = 'Success', text = '') => {
  Swal.fire({
    ...baseOptions,
    title,
    text,
    icon: 'success',
    iconColor: '#10b981', // green-500
  });
};

// ❌ Error
export const showErrorAlert = (title = 'Error', text = '') => {
  Swal.fire({
    ...baseOptions,
    title,
    text,
    icon: 'error',
    iconColor: '#f87171', // red-400
  });
};

// ⚠️ Warning
export const showWarningAlert = (title = 'Warning', text = '') => {
  Swal.fire({
    ...baseOptions,
    title,
    text,
    icon: 'warning',
    iconColor: '#fbbf24', // amber-400
  });
};

// ℹ️ Info
export const showInfoAlert = (title = 'Information', text = '') => {
  Swal.fire({
    ...baseOptions,
    title,
    text,
    icon: 'info',
    iconColor: '#60a5fa', // blue-400
  });
};

// ✅ Confirmation Alert (Reusable)
export const showConfirmAlert = async ({
  title = 'Are you sure?',
  text = '',
  confirmText = 'Yes',
  cancelText = 'Cancel',
  icon = 'warning'
}) => {
  return Swal.fire({
    title,
    text,
    icon,
    iconColor: icon === 'warning' ? '#fbbf24' : '#10b981',
    background: '#1f2937',
    color: '#e5e7eb',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#4b5563',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      popup: 'rounded-xl shadow-lg',
      confirmButton: 'text-white',
      cancelButton: 'text-white'
    }
  });
};
