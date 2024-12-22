"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { signout } from "@/services/store/modules/authSlice";
import { useDispatch } from "react-redux";

export const NavBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  console.log("user", user);

  const handleSigninClick = () => {
    router.push("/auth/signin");
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleProfileClick = () => {
    router.push("/auth/profile");
  };

  const handleSignout = () => {
    dispatch(signout());
    localStorage.removeItem("accessToken");
    router.push("/auth/signin");
  };

  return (
    <div className="bg-primary-dark h-[80px] flex items-center justify-between px-4 shadow-md">
      {/* Logo Section */}
      <div className="flex items-center space-x-4">
        <Logo />
        <span className="text-white text-lg font-semibold">Todo App</span>
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

            {/* User Profile Image */}
            <button onClick={handleProfileClick}>
              <img
                src={user?.image || "/default-avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
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
