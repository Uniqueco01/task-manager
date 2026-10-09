import React, { useEffect, useState } from 'react'
import Button from './Button'
import { Link, useNavigate} from 'react-router-dom';
import { useForm} from 'react-hook-form';
import { yupResolver} from '@hookform/resolvers/yup';
import { loginSchema } from './src/schemas';
import ForgotPasswordModal from './ForgotPasswordModal';
import { Eye, EyeOff } from 'lucide-react';
import Toast from './Toast';
import { LogUserIn } from '../lib/actions';
import useUserStore from '../store/useUserStore';
function Login() {
    const [pageLoading, setPageLoading] = useState(true);
    const [online, setOnline] = useState(navigator.onLine);
    const [success, setSuccess] = useState("");
    const [showForgot, setShowForgot] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
        const [toastMessage, setToastMessage] = useState({});
    const navigate = useNavigate();
    const user = useUserStore((s) => s.user);
    const fetchUser = useUserStore((s) => s.fetchUser);
    const{
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: {errors, isSubmitting},
        } = useForm({resolver: yupResolver(loginSchema), mode: "onTouched"});
    const serverError = errors.root?.serverError?.message;
    useEffect(() => {
        if(!serverError) return;
        const t = setTimeout(() => clearErrors("root.serverError"), 4000);
        return () => clearTimeout(t);
        }, [serverError, clearErrors]);
    useEffect(() => {
        const t = setTimeout(() => setPageLoading(false), 1000);
        return() => clearTimeout(t);
    }, []);
    useEffect(() => {
            const goOnline = () => setOnline(true);
            const goOffline = () => setOnline(false);
            window.addEventListener("online", goOnline);
            window.addEventListener("offline", goOffline);
            return() => {
                window.removeEventListener("online", goOnline);
                window.removeEventListener("offline", goOffline);
            };
        }, []);
    // const onSubmit = async (data) => {
    //    if(!navigator.onLine) {
    //     setError("root.serverError", {message: "No internet connection."});
    //     return;
    //    }
    //    const profile = await GetProfile();
    //    if (profile){
    //     navigate("/task");
    //     return;
    //    }       
    //      const {message, error, user} = await LogUserIn(data.email, data.password);
    //     console.log(error);
    //     if(!error) navigate("/task");
    //     setToastMessage({type: error ? "error" : "success", text: message});
    // };

    const onSubmit = async (data) => {
       if (!navigator.onLine) {
         setError("root.serverError", { message: "No internet connection." });
         return;
       }
       if (user) {
         navigate("/task");
         return;
       }
  const { message, error } = await LogUserIn(data.email, data.password);
       setToastMessage({ type: error ? "error" : "success", text: message });
       if (!error) {
         await fetchUser(); // tells the nav and ProtectedRoute who is logged in
         navigate("/task");
            }
     };
    if (pageLoading || !online) {
        return (
            <div className=' flex h-screen flex-col items-center justify-center gap-3'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
                <span>{!online ? "No internet. Waiting for connection..." : "Loading..."}</span>
            </div>
        );
    }
    return (
        <>
        <Toast message={toastMessage} />
        {serverError && (<div className="fixed top-17 right-0 z-[999] rounded-md bg-red-600 px-4 py-3 text-white shadow-lg">{serverError}</div>)}
        {success && (
            <div className='fixed to-17 right-0 z-[999] rounded-md bg-emerald-600 px-4 py-3 text-white shadow-lg'>✅{success}</div>
        )}
        {isSubmitting && (
            <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/50'>
                <div className=' flex flex-col items-center gap-3 rounded-md bg-white p-6 shadow-md'>
                    <div className=' h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
                    <span>Loading...</span>
                </div>
            </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className=' mx-auto p-6 bg-blue-200 shadow-md mt-10  w-1/3 rounded-lg'>
        <h1 className=' text-center text-2xl font-bold mb-1'><span className='text-blue-600'>Welcome</span> back!</h1>
        <p className=' text-center text-sm text-gray-600 mb-4'>Log in to manage your tasks.</p>
            <div>
                <label>Email: <br />
                    <input type="email" placeholder='Enter Your Email' className='form-input' {...register("email")}/>
                </label>
                {errors.email && <p className=' text-sm text-red-600'>{errors.email.message}</p>}
            </div>
            <div>
                <label>Password:
                    <div className=' relative mb-4'>
                    <input type={showPassword ? "text" : "password"} placeholder='Enter Your Password' className='form-input pr-10 mb-0'{...register("password")}
                    />
                    <button type='button' onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                      className='absolute inset-y-0 right-3 flex items-center text-slate-600 hover:text-blue-700'
                      >
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                      </button>
                    </div>
                </label>
                {errors.password && <p className=' text-sm text-red-600'>{errors.password.message}</p>}
            </div>

            <button type='button' onClick={() => setShowForgot(true)} className=' text-sm text-blue-700 hover:underline'>Forgot password</button>

            <Button type= "submit" disabled= {isSubmitting || !!success} className='py-2 px-4 w-full bg-blue-500 rounded-full text-white mt-5 font-bold shadow-lg cursor-pointer hover:bg-white hover:text-blue-600 border-2 border-blue-500 '>Login</Button>
            <Link to="/signup" className='text-blue-800  block text-center mt-3'>Don't have an account?</Link>
        </form>
        {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)}/>}
        </>
    )
}

export default Login
