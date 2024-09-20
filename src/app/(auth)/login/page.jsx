"use client"

import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormInput from '@/components/FormInput';
import SubmitButton from '@/components/SubmitButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react';
import { Context as DataContext } from '@/context/dataContext';
import toast from 'react-hot-toast';

const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().min(8, 'Must be minimum 8 characters').required('Password is required')
});

const loginInitialValues = {
    email: '',
    password: ''
};

const Login = () => {
    const router = useRouter();
    const { authenticate } = useContext(DataContext)
    const [loading, setLoading] = useState(false)

    const loginFormik = useFormik({
        initialValues: loginInitialValues,
        validationSchema: loginValidationSchema,
        onSubmit: async (values) => {
            const body = JSON.stringify({
                email: values.email,
                password: values.password
            })
            

            try {
                setLoading(true)
                const res = await fetch(`${process.env.DOMAIN}/api/login`, {
                    credentials: "include",
                    method: "POST",
                    body,
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json()
                if (data?.success) {
                    authenticate(data)
                    toast.success("Logged in successfully")
                    router.replace("/onboarding")
                } else {
                    throw new Error('Login failed!!');
                }
            } catch (err) {
                setLoading(false)
                toast.error("Login failed")
            }
        },
    });


    return (
        <div className='flex justify-center items-center bg-black text-white min-h-screen p-5 sm:p-10' >
            <div className='w-full sm:w-auto lg:w-[40%] xl:w-[35%]' >
                <p className='text-4xl font-semibold text-center mb-10' >Register to your account</p>
                <form className='border p-10 sm:p-14 pb-16 rounded-xl' onSubmit={loginFormik.handleSubmit} >
                    <FormInput name="Email" value={loginFormik.values.email} onChange={loginFormik.handleChange} onBlur={loginFormik.handleBlur} touched={loginFormik.touched.email} error={loginFormik.errors.email} placeholder='Email*' type='email' />
                    <FormInput name="Password" value={loginFormik.values.password} onChange={loginFormik.handleChange} onBlur={loginFormik.handleBlur} touched={loginFormik.touched.password} error={loginFormik.errors.password} placeholder='Password*' type='password' />
                    <div className='mt-7' >
                        <p>Don't have an account? <Link href="/signup" className='text-blue-500 underline' >create account</Link></p>
                    </div>
                    <SubmitButton name="Login" loading={loading} />
                </form>
            </div>
        </div>
    )
}

export default Login