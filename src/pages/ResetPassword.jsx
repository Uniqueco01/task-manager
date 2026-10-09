import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import { useForm} from 'react-hook-form';
import { yupResolver} from '@hookform/resolvers/yup';
import { Eye, EyeOff } from 'lucide-react';
import Toast from '../components/Toast';
import { LogUserIn } from '../lib/actions';
import { loginSchema } from '../components/src/schemas';
import Button from '../components/Button';
import { account } from '../lib/appwrite';

function ResetPassword() {
    const [pageLoading, setPageLoading] = useState(true);
    const [online, setOnline] = useState(navigator.onLine);
    const [showPassword, setShowPassword] = useState(false);
    const [toastMessage, setToastMessage] = useState({});
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
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

    const onSubmit = async (e) => {
        e.preventDefault();
       if (!navigator.onLine) {
         setError("root.serverError", { message: "No internet connection." });
         return;
       }
       try {
        const res = await account.updateRecovery({
            userId: searchParams.get("userId"),
            secret: searchParams.get("secret"),
            password
        })
        navigate("/login");
       } catch (error) {
        console.log(error);
        setToastMessage({ type: "error", text: error.message });
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
        
        <form onSubmit={onSubmit} className=' mx-auto p-6 bg-blue-200 shadow-md mt-10  w-1/3 rounded-lg'>
        <h1 className=' text-center text-2xl font-bold mb-1'>Reset password</h1>
        
            
            <div>
                <label>Password:
                    <div className=' relative mb-4'>
                    <input type={showPassword ? "text" : "password"} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your new password' className='form-input pr-10 mb-0'
                    />
                    <button type='button' onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                      className='absolute inset-y-0 right-3 flex items-center text-slate-600 hover:text-blue-700'
                      >
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                      </button>
                    </div>
                </label>
            </div>

            

            <Button type= "submit" disabled={!password} className='py-2 px-4 w-full bg-blue-500 rounded-full text-white mt-5 font-bold shadow-lg cursor-pointer hover:bg-white hover:text-blue-600 border-2 border-blue-500 '>Reset Password</Button>
           
        </form>
    
        </>
    )
}

export default ResetPassword
