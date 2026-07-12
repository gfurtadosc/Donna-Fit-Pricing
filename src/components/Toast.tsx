interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6">
      <div className="animate-toast-in rounded-2xl bg-sageDark px-4 py-3 text-sm font-medium text-white shadow-lg">
        {message}
      </div>
    </div>
  );
}
