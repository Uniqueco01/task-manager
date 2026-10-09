import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { securityResetSchema } from "./src/schemas";
import { Eye, EyeOff } from "lucide-react";
import Button from "./Button";
import {  GetUserByEmail, ResetPasswordWithAnswer } from "../lib/actions";
import { account } from "../lib/appwrite";
import Toast from "./Toast";

function EmailStep({ onDone, onClose }) {
    const [toastMsg, setToastMsg] = useState({});
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        clearErrors("root.serverError");
        const mail = data.email.trim().toLowerCase();
        // const result = await GetSecurityQuestion(mail);
        // const {user, error} = await GetUserByEmail(mail);
        try {
            const res = account.createRecovery({
                email: mail, url: `${window.location.origin}/reset-password`,
            })
            setToastMsg({type: 'info', text: 'Reset link sent to your email'})
        } catch (error) {
            console.log(error);
            setToastMsg({type: 'error', text: 'Unable to send reset link'})
        }
        // onDone(mail, user.securityQuestion);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Toast message={toastMsg} />
            <h2 className=" mb-2 text-xl font-bold">Forgot password?</h2>
            <input
                type="email"
                placeholder="Enter your email"
                className="form-input"
                {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                })}
            />
            {errors.email && <p className=" text-sm text-red-600">{errors.email.message}</p>}
            {errors.root?.serverError && (
                <p className=" text-sm text-red-600">{errors.root.serverError.message}</p>
            )}
            <Button
                type="submit"
                disabled={isSubmitting}
                className=" mt-4 w-full rounded-full bg-blue-500 px-4 py-2 font-bold text-white disabled:opacity-60 "
            >
                {isSubmitting ? "Checking..." : "Continue"}
            </Button>
            <Button
                type="button"
                onClick={onClose}
                className=" mt-4 w-full rounded-full px-4 py-2 font-bold text-gray-600"
            >
                Cancel
            </Button>
        </form>
    );
}

function ResetStep({ email, question, onDone }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(securityResetSchema) });

    const onSubmit = async (data) => {
        clearErrors("root.serverError");
        const result = await ResetPasswordWithAnswer(email, data.securityAnswer, data.password);
        if (!result.ok) {
            setError("root.serverError", { message: result.message });
            return;
        }
        onDone();
    };

    return (
        <form
            onSubmit={(e) => {
                e.stopPropagation();
                handleSubmit(onSubmit)(e);
            }}
            noValidate
        >
            <h2 className=" mb-2 text-xl font-bold">Verify it's you</h2>
            <p className=" mb-1 text-sm font-semibold">{question}</p>
            <input
                type="text"
                placeholder="Your answer"
                className=" form-input"
                {...register("securityAnswer")}
            />
            {errors.securityAnswer && (
                <p className=" text-sm text-red-600">{errors.securityAnswer.message}</p>
            )}

            <div className=" relative mb-4">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="form-input pr-10 mb-0"
                    {...register("password")}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-600 hover:text-blue-700"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {errors.password && <p className=" text-sm text-red-600">{errors.password.message}</p>}

            <div className=" relative mb-4">
                <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new Password"
                    className="form-input pr-10 mb-0"
                    {...register("confirmPassword")}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-600 hover:text-blue-700"
                >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {errors.confirmPassword && (
                <p className=" text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}

            {errors.root?.serverError && (
                <p className=" text-sm text-red-600">{errors.root.serverError.message}</p>
            )}
            <Button
                type="submit"
                disabled={isSubmitting}
                className=" mt-4 w-full rounded-full bg-emerald-500 px-4 py-2 font-bold text-white disabled:opacity-60"
            >
                {isSubmitting ? "Saving..." : "Reset password"}
            </Button>
        </form>
    );
}

function ForgotPasswordModal({ onClose }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [question, setQuestion] = useState("");

    return (
        <div
            className=" fixed inset-0 z-[999] flex items-center justify-center bg-black/50 "
            onClick={onClose}
        >
            <div
                className="w-11/12 max-w-sm rounded-lg bg-white p-6 shadow-md"
                onClick={(e) => e.stopPropagation()}
            >
                {step === 1 && (
                    <EmailStep
                        onClose={onClose}
                        onDone={(e, q) => {
                            setEmail(e);
                            setQuestion(q);
                            setStep(2);
                        }}
                    />
                )}
                {step === 2 && (
                    <ResetStep email={email} question={question} onDone={() => setStep(3)} />
                )}
                {step === 3 && (
                    <>
                        <p className=" text-sm">✅ Password changed. You can now log in.</p>
                        <Button
                            onClick={onClose}
                            className=" mt-4 w-full rounded-full bg-blue-500 px-4 py-2 font-bold text-white"
                        >
                            Back to login
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordModal;