import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Pre-configured SweetAlert instance with styling matching the admin dashboard
const Toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#ffffff',
  color: '#1a1a1a',
  customClass: {
    popup: 'shadow-lg border border-border rounded-xl',
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

const Modal = MySwal.mixin({
  customClass: {
    popup: 'rounded-2xl shadow-xl border border-border',
    confirmButton: 'bg-primary text-black font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-primary/90 transition-all',
    cancelButton: 'bg-white text-text-primary border border-border font-semibold px-6 py-2.5 rounded-lg hover:bg-black/5 transition-all',
    title: 'text-2xl font-bold text-text-primary',
    htmlContainer: 'text-text-muted',
  },
  buttonsStyling: false,
});

export const alerts = {
  // Toast notifications for small successes (e.g. copied to clipboard)
  toastSuccess: (title: string) => {
    return Toast.fire({ icon: 'success', title });
  },
  toastError: (title: string) => {
    return Toast.fire({ icon: 'error', title });
  },
  toastInfo: (title: string) => {
    return Toast.fire({ icon: 'info', title });
  },

  // Centered modals for CRUD actions
  success: (title: string, text?: string) => {
    return Modal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: 'Great!',
    });
  },
  
  error: (title: string, text?: string) => {
    return Modal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'Close',
    });
  },

  // Confirmation dialogs
  confirmDelete: async (itemName: string = 'this item') => {
    const result = await Modal.fire({
      title: 'Are you sure?',
      html: `You are about to delete <strong>${itemName}</strong>.<br/>This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'bg-danger text-white font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-danger/90 transition-all mr-3',
      },
    });
    return result.isConfirmed;
  },

  confirmAction: async (title: string, text: string, confirmText: string = 'Confirm') => {
    const result = await Modal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
    });
    return result.isConfirmed;
  }
};
