const Loader = ({ fullScreen = false, message = "កំពុងដំណើរការ..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      {/* Spinner Animation */}
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />

      {/* Message Label */}
      {message && (
        <p className="text-sm font-medium text-slate-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  // Full screen loading overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  // Inline container loading
  return (
    <div className="w-full flex justify-center items-center py-12">
      {content}
    </div>
  );
};

export default Loader;
