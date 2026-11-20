import { Link } from "react-router-dom";

export const Landing = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="flex w-full max-w-lg flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">BookEz</h1>
          <p className="mt-2 text-gray-500">Laundry management made easy.</p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <Link
            to="/admin"
            className="flex w-full items-center justify-center rounded-xl bg-gray-900 p-5 font-semibold text-white transition hover:bg-gray-700"
          >
            Admin
          </Link>

          <Link
            to="/staff"
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 p-5 font-semibold text-white transition hover:bg-blue-700"
          >
            Staff
          </Link>

          <Link
            to="/customer"
            className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white p-5 font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            Customer
          </Link>
        </div>

        <p className="text-sm text-gray-400">
          © 2026 BookEz. All rights reserved.
        </p>
      </div>
    </main>
  );
};
