import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCurrentUser } = useAuth();
  const [error, setError] = useState("");
  const token = searchParams.get("access_token") ?? searchParams.get("token");

  useEffect(() => {
    let isActive = true;
    let redirectTimer;

    const completeSignIn = async () => {
      if (!token) {
        if (isActive) {
          setError("មិនទទួលបាន Token ពីប្រព័ន្ធឡើយ");
          redirectTimer = window.setTimeout(
            () => navigate("/login", { replace: true }),
            2000,
          );
        }
        return;
      }

      localStorage.setItem("access_token", token);

      try {
        const user = await fetchCurrentUser();
        if (!isActive) return;

        if (user) {
          navigate("/dashboard", { replace: true });
          return;
        }

        setError("បរាជ័យក្នុងការទាញយកទិន្នន័យអ្នកប្រើប្រាស់");
      } catch {
        if (isActive) {
          setError("បរាជ័យក្នុងការទាញយកទិន្នន័យអ្នកប្រើប្រាស់");
        }
      }

      if (isActive) {
        redirectTimer = window.setTimeout(
          () => navigate("/login", { replace: true }),
          2000,
        );
      }
    };

    void Promise.resolve().then(completeSignIn);

    return () => {
      isActive = false;
      window.clearTimeout(redirectTimer);
    };
  }, [fetchCurrentUser, navigate, token]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full text-center">
        {error ? (
          <div className="text-red-500 font-medium text-sm">
            <p>{error}</p>
            <p className="text-slate-400 text-xs mt-2">
              កំពុងបញ្ជូនទៅកាន់ទំព័រ Login...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <h3 className="text-base font-bold text-slate-800">
              កំពុងផ្ទៀងផ្ទាត់គណនី Google...
            </h3>
            <p className="text-xs text-slate-500">សូមរង់ចាំមួយភ្លែត</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
