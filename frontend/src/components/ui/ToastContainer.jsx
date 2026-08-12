import { useAlert } from '../../context/AlertContext';
import Toast from './Toast';

const ToastContainer = () => {
  const { toasts, removeToast } = useAlert();
  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
