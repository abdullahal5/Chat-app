/* eslint-disable no-unused-vars */
import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { IoIosLock } from "react-icons/io";
import { FaEye, FaUpload } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import {
  useAddUserMutation,
  useLoginMutation,
} from "../../redux/features/callApis/userApi";
import { toast } from "sonner";
import { verifyToken } from "../../utils/verifyToken";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/slice/authSlice";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [addUser] = useAddUserMutation(undefined);
  const [login] = useLoginMutation(undefined);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("loggin in");
    const email = e.target.email.value;
    const password = e.target.password.value;
    const userData = {
      email,
      password,
    };
    const res = await login(userData);
    const token = res?.data?.data;

    try {
      if (res?.data?.success === true) {
        const user = await verifyToken(token);
        dispatch(setUser({ user: user, token }));
        toast.success("logged in", { id: toastId, duration: 2000 });
        navigate(`/`);
        toast.success(res.data.message, {
          id: toastId,
          duration: 2000,
        });
      } else {
        toast.error(res?.error?.data?.message, {
          id: toastId,
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        id: toastId,
        duration: 2000,
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("creating");
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const pic = e.target.profile.files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("file", pic);

    try {
      const res = await addUser(formData);
      const token = res?.data?.token;
      if (res?.data?.success === true) {
        const user = await verifyToken(token);
        dispatch(setUser({ user: user, token }));
        toast.success("logged in", { id: toastId, duration: 2000 });
        navigate(`/`);
        toast.success(res.data.message, {
          id: toastId,
          duration: 2000,
        });
      } else {
        toast.error(res?.error?.data?.message, {
          id: toastId,
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        id: toastId,
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-96">
        <h1
          className={`${
            activeTab === "signup" ? "text-3xl" : "text-5xl"
          } text-center`}
        >
          {activeTab === "signup" ? "Sign Up" : "Welcome Back"}
        </h1>
        <p className="text-lg text-gray-600 pt-1 text-center">
          Please enter your details here
        </p>
        <div className="w-full py-5">
          <ul className="flex items-center justify-around bg-gray-200 rounded-xl p-1 w-[100%] duration-300">
            <li className="w-[50%]">
              <button
                className={`${
                  activeTab === "login"
                    ? " bg-white py-2 rounded-xl text-purple-700 border-purple-600 border"
                    : ""
                } inline-block w-full font-semibold`}
                onClick={() => handleTabChange("login")}
              >
                Login
              </button>
            </li>
            <li className="w-[50%]">
              <button
                className={`${
                  activeTab === "signup"
                    ? " bg-white py-2 rounded-xl text-purple-700 border-purple-600 border"
                    : ""
                } inline-block w-full font-semibold`}
                onClick={() => handleTabChange("signup")}
              >
                Sign Up
              </button>
            </li>
          </ul>
          <div className="mt-5">
            {activeTab === "login" && (
              <form onSubmit={handleLogin}>
                <div className="relative">
                  <label className="pl-1">Enter Your E-mail*</label>
                  <input
                    type="email"
                    className="w-full rounded-xl py-3 bg-gray-200 pl-12 pr-2  outline-none mt-2"
                    placeholder="example@gmail.com"
                    // value={guestEmail && guestEmail}
                    name="email"
                  />
                  <MdOutlineEmail
                    fontSize="2.5rem"
                    className="absolute text-gray-600 left-0 top-9 pl-3"
                  />
                </div>
                <div className="pt-5">
                  <div className="relative">
                    <label className="pl-1">Enter Your Password*</label>
                    <input
                      type={isShowPassword ? "text" : "password"}
                      className="w-full rounded-xl py-3 bg-gray-200 pl-12 pr-2  outline-none mt-2"
                      placeholder="up to 8 characters"
                      // value={guestPassword}
                      name="password"
                    />
                    <IoIosLock
                      fontSize="2.5rem"
                      className="absolute text-gray-600 left-0 top-9 pl-3"
                    />
                    {isShowPassword ? (
                      <FaEyeSlash
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        fontSize="1.2rem"
                        className="absolute right-4 text-gray-600 top-[48px] cursor-pointer"
                      />
                    ) : (
                      <FaEye
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        fontSize="1.2rem"
                        className="absolute right-4 text-gray-600 top-[48px] cursor-pointer"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="bg-purple-700 text-white w-full text-center mx-auto py-3 mt-7 rounded-lg focus:bg-purple-700 active:bg-purple-800"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setGuestEmail("guest@example.com");
                      setGuestPassword("123456");
                    }}
                    type="button"
                    className="bg-rose-700 text-white w-full text-center mx-auto py-3 mt-7 rounded-lg active:bg-rose-800"
                  >
                    Login as a guest user
                  </button>
                </div>
              </form>
            )}
            {activeTab === "signup" && (
              <form onSubmit={handleSignup}>
                <div className="relative">
                  <label className="pl-1">Enter Your Name*</label>
                  <input
                    type="text"
                    className="w-full rounded-xl py-2.5 bg-gray-200 pl-12 pr-2  outline-none mt-2"
                    placeholder="Jhon doe"
                    name="name"
                  />
                  <FaUser
                    fontSize="2rem"
                    className="absolute text-gray-600 left-0 top-10 pl-3"
                  />
                </div>
                <div className="relative pt-3">
                  <label className="pl-1">Enter Your E-mail*</label>
                  <input
                    type="email"
                    className="w-full rounded-xl py-2.5 bg-gray-200 pl-12 pr-2  outline-none mt-2"
                    placeholder="example@gmail.com"
                    name="email"
                  />
                  <MdOutlineEmail
                    fontSize="2.5rem"
                    className="absolute text-gray-600 left-0 top-[50px] pl-3"
                  />
                </div>
                <div className="pt-3">
                  <div className="relative">
                    <label className="pl-1">Enter Your Password*</label>
                    <input
                      type={isShowPassword ? "text" : "password"}
                      className="w-full rounded-xl py-2.5 bg-gray-200 pl-12 pr-2  outline-none mt-2"
                      placeholder="up to 8 characters"
                      name="password"
                    />
                    <IoIosLock
                      fontSize="2.5rem"
                      className="absolute text-gray-600 left-0 top-9 pl-3"
                    />
                    {isShowPassword ? (
                      <FaEyeSlash
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        fontSize="1.2rem"
                        className="absolute right-4 text-gray-600 top-[48px] cursor-pointer"
                      />
                    ) : (
                      <FaEye
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        fontSize="1.2rem"
                        className="absolute right-4 text-gray-600 top-[48px] cursor-pointer"
                      />
                    )}
                  </div>
                </div>
                <div className="relative pt-3">
                  <label className="pl-1">Enter Your Profile pic</label>
                  <input
                    type="file"
                    className="w-full rounded-xl py-2 bg-gray-200 pl-12 pr-2  outline-none mt-2"
                    placeholder="Jhon doe"
                    name="profile"
                  />
                  <FaUpload
                    fontSize="2rem"
                    className="absolute text-gray-600 left-0 top-14 pl-3"
                  />
                </div>
                <div>
                  <button className="bg-purple-700 text-white w-full text-center mx-auto py-3 mt-7 rounded-lg focus:bg-purple-700 active:bg-purple-800">
                    Sign Up
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
