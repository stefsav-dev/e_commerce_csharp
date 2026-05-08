const Loader = () => {
  return (
    <div className="flex min-h-40 items-center justify-center" role="status" aria-label="Loading">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
    </div>
  );
};

export default Loader;
