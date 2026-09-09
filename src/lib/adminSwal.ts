import Swal from 'sweetalert2';

const confirmBtn =
  'inline-flex items-center justify-center rounded-full bg-[#05238a] hover:bg-[#e07a14] text-white font-semibold text-sm px-6 py-2.5 mx-1 transition-colors';
const cancelBtn =
  'inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm px-6 py-2.5 mx-1 transition-colors';
const dangerBtn =
  'inline-flex items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm px-6 py-2.5 mx-1 transition-colors';

export async function adminConfirm(opts: {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}): Promise<boolean> {
  const result = await Swal.fire({
    title: opts.title,
    text: opts.text,
    icon: opts.danger ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: opts.confirmText || 'Confirm',
    cancelButtonText: opts.cancelText || 'Cancel',
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-2xl shadow-xl border border-slate-100 !p-6',
      title: '!text-lg !font-bold !text-slate-800',
      htmlContainer: '!text-sm !text-slate-600',
      confirmButton: opts.danger ? dangerBtn : confirmBtn,
      cancelButton: cancelBtn,
    },
  });
  return result.isConfirmed;
}

export function adminSuccess(title: string, text?: string) {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2200,
    showConfirmButton: false,
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-2xl shadow-xl border border-slate-100 !p-6',
      title: '!text-lg !font-bold !text-slate-800',
      htmlContainer: '!text-sm !text-slate-600',
    },
  });
}

export function adminError(title: string, text?: string) {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-2xl shadow-xl border border-slate-100 !p-6',
      title: '!text-lg !font-bold !text-slate-800',
      htmlContainer: '!text-sm !text-slate-600',
      confirmButton: confirmBtn,
    },
  });
}

export function adminToast(title: string, icon: 'success' | 'error' | 'info' = 'success') {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
}
