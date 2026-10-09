import React, { useEffect, useState } from 'react'
import Button from './Button'
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from './src/schemas';
import { Eye, EyeOff } from 'lucide-react';
import { CreateUser } from '../lib/actions';
import Toast from './Toast';

function Signup() {
    const [pageLoadig, setPageLoadig] = useState(true);
    const [online, setOnline] = useState(navigator.onLine);
    const [success, setSuccess] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [toastMessage, setToastMessage] = useState({});
    const navigate = useNavigate();
    const{
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: {errors, isSubmitting},
    } = useForm({resolver: yupResolver(signupSchema), mode: "onTouched"});
    const serverError = errors.root?.serverError?.message;
    useEffect(() => {
        if(!serverError) return;
        const t = setTimeout(() => clearErrors("root.serverError"), 4000);
        return () => clearTimeout(t);
    }, [serverError, clearErrors]);

    useEffect(() => {
        const t = setTimeout(() => setPageLoadig(false), 1000);
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

    const onSubmit = async (data) => {
       if(!navigator.onLine) {
        setError("root.serverError", {message: "No internet connection."});
        return;
       }
        const {message, error , user} = await CreateUser(data);
        console.log(error, '======================>');
        if(!error) navigate("/login");
        setToastMessage({type: error ? "error" : "success", text: message});
        // await new Promise((resolve) => setTimeout(resolve, 1500));
        // console.log(data);
        // setSuccess("Account created successfully! Redirecting to login...");
    };

    if (pageLoadig || !online) {
        return (
            <div className=' flex h-screen flex-col items-center justify-center gap-3'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
                <span>{!online ? "No internet. Waiting for connection..." : "Loading..."}</span>
            </div>
        );
    }

    
    return (
        <>
        {serverError && (<div className="fixed top-17 right-0 z-[999] rounded-md bg-red-600 px-4 py-3 text-white shadow-lg">{serverError}</div>)}

        {success && (
            <div className='fixed to-17 right-0 z-[999] rounded-md bg-emerald-600 px-4 py-3 text-white shadow-lg'>✅{success}</div>
        )}
        <Toast message={toastMessage} />
        {isSubmitting && (
            <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/50'>
                <div className=' flex flex-col items-center gap-3 rounded-md bg-white p-6 shadow-md'>
                    <div className=' h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
                    <span>Loading...</span>
                </div>
            </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className=' mx-auto p-6 bg-blue-200 shadow-md mt-10 w-11/12 max-w-md rounded-lg'>
            <h1 className=' text-center text-2xl font-bold mb-4'>Create your account</h1>
            <div>
            <label>Username: <br />
                <input type="text" placeholder='Enter Your User Name' className='form-input' {...register("username")}/>
            </label>
            {errors.username && <p className=' text-sm text-red-600'>{errors.username.message}</p>}
            <label>Email: <br />
                <input type="email" placeholder='Enter Your Email' className='form-input' {...register("email")}/>
            </label>
            {errors.email && <p className=' text-sm text-red-600'>{errors.email.message}</p>}
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
        <Link to="/login" className='text-blue-800'>Already have an account?</Link>
        <Button type= "submit" disabled= {isSubmitting || !!success} className='py-2 px-4 w-full bg-blue-500 rounded-full text-white mt-5 font-bold shadow-lg cursor-pointer hover:bg-white hover:text-blue-600 border-2 border-blue-500 '>Signup</Button>
        </form>
        </>
    )
}

export default Signup
