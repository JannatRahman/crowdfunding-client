export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function CardLoader() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-xl h-48" />
      <div className="mt-4 space-y-3">
        <div className="bg-gray-200 rounded h-4 w-3/4" />
        <div className="bg-gray-200 rounded h-4 w-1/2" />
        <div className="bg-gray-200 rounded h-3 w-full" />
      </div>
    </div>
  );
}
