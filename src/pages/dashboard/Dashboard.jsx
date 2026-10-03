import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
	const { user, logout } = useAuth();
	const displayName = user?.name || user?.email || 'there';

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6 py-12">
			<section className="w-full border-l-4 border-indigo-600 bg-white px-8 py-10 shadow-sm">
				<p className="mb-2 text-sm font-medium uppercase text-indigo-700">LifePilot AI</p>
				<h1 className="mb-2 text-3xl font-bold text-slate-900">Welcome, {displayName}</h1>
				<p className="mb-8 text-slate-600">You are signed in and your account is ready.</p>
				<button
					type="button"
					onClick={logout}
					className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
				>
					Sign out
				</button>
			</section>
		</main>
	);
};

export default Dashboard;
