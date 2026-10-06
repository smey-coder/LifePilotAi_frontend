import AppRoutes from "./routes/AppRoutes";
const App = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
      <AppRoutes />
    </div>
  );
};

export default App;
