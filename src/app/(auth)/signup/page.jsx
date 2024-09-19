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

const signupValidationSchema = Yup.object().shape({
    name: Yup.string().required('First name is required'),
    email: Yup.string().email().required('Primary email is required'),
    phone: Yup.number().required('Phone number is required'),
    password: Yup.string().min(8).required('Password is required'),
    confirmpassword: Yup.string().min(8).required('Confirm password is required')
});

const signupInitialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmpassword: '',
};

const Signup = () => {
    const router = useRouter();
    const { authenticate } = useContext(DataContext)
    const [loading, setLoading] = useState(false)

    const signupFormik = useFormik({
        initialValues: signupInitialValues,
        validationSchema: signupValidationSchema,
        onSubmit: async (values) => {

            if (values?.password === values?.confirmpassword) {
                const body = JSON.stringify({
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    password: values.password
                })

                console.log(body);
                

                try {
                    setLoading(true)
                    const res = await fetch(`${process.env.DOMAIN}/api/signup`, {
                        credentials: "include",
                        method: "POST",
                        body,
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const data = await res.json()
                    if (data?.success) {
                        authenticate(data)
                        toast.success("Signed up successfully")
                        router.replace("/")
                    } else {
                        throw new Error('Signed Up failed!!');
                    }
                } catch (err) {
                    setLoading(false)
                    toast.error("Signup failed")
                    console.error(err);
                }
            } else {
                signupFormik.setFieldError('confirmpassword', 'Passwords do not match')
            }
        },
    });


    return (
        <div className='flex justify-center items-center bg-black text-white min-h-screen p-5 sm:p-10' >
            <div className='w-full md:w-auto lg:w-[40%]' >
                <p className='text-4xl font-semibold text-center mb-10' >Create an account</p>
                <form className='border p-10 sm:p-14 pb-16 rounded-xl' onSubmit={signupFormik.handleSubmit} >
                    <FormInput name="Name" value={signupFormik.values.name} onChange={signupFormik.handleChange} onBlur={signupFormik.handleBlur} touched={signupFormik.touched.name} error={signupFormik.errors.name} type='text' placeholder='Name*' />
                    <div className='grid md:grid-cols-2 md:gap-x-3' >
                        <FormInput name="Email" value={signupFormik.values.email} onChange={signupFormik.handleChange} onBlur={signupFormik.handleBlur} touched={signupFormik.touched.email} error={signupFormik.errors.email} type='email' placeholder='Email*' />
                        <FormInput name="Phone" value={signupFormik.values.phone} onChange={signupFormik.handleChange} onBlur={signupFormik.handleBlur} touched={signupFormik.touched.phone} error={signupFormik.errors.phone} type='tel' placeholder='Phone*' />
                    </div>

                    <FormInput name="Password" value={signupFormik.values.password} onChange={signupFormik.handleChange} onBlur={signupFormik.handleBlur} touched={signupFormik.touched.password} error={signupFormik.errors.password} type='password' placeholder='Password*' />
                    <FormInput name="Confirm Password" value={signupFormik.values.confirmpassword} onChange={signupFormik.handleChange} onBlur={signupFormik.handleBlur} touched={signupFormik.touched.confirmpassword} error={signupFormik.errors.confirmpassword} type='password' placeholder='Confirm password*' />
                    <div className='mt-7' >
                        <p>Already have an account? <Link href="/login" className='text-blue-500 underline' >login</Link></p>
                    </div>
                    <SubmitButton name="Sign Up" loading={loading} />
                </form>
            </div>
        </div>
    )
}

export default Signup