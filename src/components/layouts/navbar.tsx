"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { signout } from "@/services/store/modules/authSlice";
import { useDispatch } from "react-redux";

export const NavBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  const handleSigninClick = () => {
    router.push("/auth/signin");
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleSignout = () => {
    dispatch(signout());
    localStorage.removeItem("accessToken");
    router.push("/auth/signin");
  };

  return (
    <div className="bg-primary-dark h-[80px] flex items-center justify-between px-4 shadow-md">
      {/* Add Task */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push("/add-task")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
        >
          Add Task
        </button>
      </div>

      {/* Navigation / Actions */}
      <div className="flex items-center space-x-6">
        {isAuthenticated ? (
          <>
            {/* Home Link */}
            <button
              onClick={handleHomeClick}
              className="text-white hover:underline"
            >
              Home
            </button>

            {/* Signout Button */}
            <button
              onClick={handleSignout}
              className="text-white bg-red-600 rounded-full px-4 py-2 hover:bg-red-500"
            >
              Signout
            </button>
          </>
        ) : (
          <button
            onClick={handleSigninClick}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-500"
          >
            Signin
          </button>
        )}
      </div>
    </div>
  );
};
