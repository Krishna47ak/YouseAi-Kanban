"use client";

import { useState, useEffect, useContext } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SyncLoader from "react-spinners/SyncLoader";
import Input from "@/components/Input";
import toast from "react-hot-toast";
import { Context as DataContext } from '@/context/dataContext';
import FormInput from "@/components/FormInput";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"

const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const taskValidationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    priority: Yup.string().required('Priority is required'),
    dueDate: Yup.date().min((new Date()), 'Please choose a due date that is today or later').required('Due date is required')
});

const taskInitialValues = {
    title: '',
    description: '',
    priority: '',
    dueDate: '',
};

const priorityOptions = ["LOW", "MEDIUM", "HIGH"]

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [boardName, setBoardName] = useState("");
    const router = useRouter();

    const { state: { user: { name, onBoarded } }, fetchUser } = useContext(DataContext)

    useEffect(() => {
        if (onBoarded) {
            router.replace("/myboard");
        }
    }, [onBoarded]);

    const stepOneSubmit = (e: any) => {
        e.preventDefault()
        setBoardName(e.target.boardname.value)
        setStep(2);
    };

    const goBack = () => {
        setStep(1);
    };

    const taskFormik = useFormik({
        initialValues: taskInitialValues,
        validationSchema: taskValidationSchema,
        onSubmit: async (values) => {
            const body = JSON.stringify({
                boardName: boardName,
                task: {
                    title: values.title,
                    description: values.description,
                    priority: values.priority,
                    dueDate: values.dueDate,
                }
            })


            try {
                setLoading(true)
                const res = await fetch(`${process.env.DOMAIN}/api/onboarding`, {
                    credentials: "include",
                    method: "POST",
                    body,
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json()
                if (data?.success) {
                    fetchUser()
                    toast.success(`Welcome to your new board ${name}`);
                    router.replace("/myboard");
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
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center pt-[82px] w-[90%] h-[calc(100vh-5rem)] mx-auto max-w-[1450px] text-white"
        >
            {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full text-center" >
                    <h1 className="mb-10 text-4xl font-bold uppercase">
                        Hello <span className="text-purple-600" >{name}</span>! 🚀 Ready to personalize your board?
                        <br />
                        Let’s give it a name!
                    </h1>
                    <form className="flex flex-col gap-10 items-center" onSubmit={stepOneSubmit} >
                        <Input type="text" name="boardname" placeholder="My Board Name..." disabled={loading} />
                        <Button type="submit" >Continue</Button>
                    </form>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full text-center" >
                    <h1 className="mb-10 text-4xl font-bold uppercase">
                        Now Let's Add your first task! 😊
                    </h1>
                    <form onSubmit={taskFormik.handleSubmit} className="flex flex-col gap-10 items-center" >
                        <div className="text-left w-[40%]" >
                            <FormInput name="Title" value={taskFormik.values.title} onChange={taskFormik.handleChange} onBlur={taskFormik.handleBlur} touched={taskFormik.touched.title} error={taskFormik.errors.title} placeholder='Title*' type='text' />
                            <FormInput name="Description" value={taskFormik.values.description} onChange={taskFormik.handleChange} onBlur={taskFormik.handleBlur} touched={taskFormik.touched.description} error={taskFormik.errors.description} placeholder='Description*' type='text' />
                            <div className='mb-5 mt-10' >
                                {/* <Select name='priority' value={taskFormik.values.priority} onValueChange={taskFormik.handleChange} onBlur={taskFormik.handleBlur}  >
                                    <SelectTrigger className="w-full bg-white text-gray-500 rounded-xl py-5">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorityOptions?.map(opt => (
                                            <SelectItem key={opt} value={opt} className='uppercase'>{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select> */}

                                <select name='priority' className={`text-gray-500 w-full py-3 rounded-xl px-4 ${!!taskFormik.values.priority && "uppercase"}`} value={taskFormik.values.priority} onChange={taskFormik.handleChange} onBlur={taskFormik.handleBlur} >
                                    <option value="" className={`text-gray-500 capitalize`} >Priority</option>
                                    {priorityOptions?.map(opt => (
                                        <option key={opt} value={opt} className='uppercase' >{opt}</option>
                                    ))}
                                </select>
                                {taskFormik.touched.priority && <span className='first-letter:uppercase text-sm text-red-500 pl-1 mt-1' >{taskFormik.errors.priority}</span>}
                            </div>
                            <div>
                                <label>Due Date:</label>
                                <input name="dueDate" value={taskFormik.values.dueDate} onChange={taskFormik.handleChange} onBlur={taskFormik.handleBlur} className={`w-full py-3 rounded-xl mt-2 outline-blue-600 text-black px-5`} type="date" accept=".pdf" placeholder="Due Date" min={new Date().toISOString().split("T")[0]} required />
                                {taskFormik.touched.dueDate && <span className='first-letter:uppercase text-sm text-red-500 pl-1 mt-1' >{taskFormik.errors.dueDate}</span>}
                            </div>
                        </div>

                        <div className="flex justify-between w-4/5 mb-10">
                            <Button onClick={goBack} disabled={loading} >
                                &#8592; Go Back
                            </Button>
                            <Button type="submit" disabled={loading} >
                                Continue
                            </Button>
                        </div>
                        {loading ? (
                            <div className="flex gap-3 items-center text-white">
                                <SyncLoader color="#fff" />
                                <span>Setting Up Your Board</span>
                            </div>
                        ) : null}
                    </form>
                </motion.div>
            )
            }
        </motion.div >
    );
};

export default Onboarding;
