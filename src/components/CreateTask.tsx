"use client";

import { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from "react-hot-toast";
import FormInput from "@/components/FormInput";
import { Button } from "./ui/button";
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);


const taskValidationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    priority: Yup.string().required('Priority is required'),
    dueDate: Yup.date().min(yesterday, 'Please choose a due date that is today or later').required('Due date is required')
});

const taskInitialValues = {
    title: '',
    description: '',
    priority: '',
    dueDate: '',
};

const priorityOptions = ["LOW", "MEDIUM", "HIGH"]

const CreateTask = ({ action, closeModal }: { action: Function; closeModal: () => void }) => {
    const [loading, setLoading] = useState(false);


    const taskFormik = useFormik({
        initialValues: taskInitialValues,
        validationSchema: taskValidationSchema,
        onSubmit: async (values) => {
            const body = JSON.stringify({
                title: values.title,
                description: values.description,
                priority: values.priority,
                dueDate: values.dueDate,
            })

            setLoading(true)
            action(body)
            closeModal()
            setLoading(false)
        },
    });
    return (
        <div className="w-full" >
            <form onSubmit={taskFormik.handleSubmit} className="flex flex-col gap-10 items-center" >
                <div className="text-left w-full" >
                    <FormInput name="Title" value={taskFormik.values.title} onChange={taskFormik.handleChange} onBlur={taskFormik.handleBlur} touched={taskFormik.touched.title} error={taskFormik.errors.title} placeholder='Title*' type='text' />
                    <FormInput name="Description" value={taskFormik.values.description} onChange={taskFormik.handleChange} onBlur={taskFormik.handleBlur} touched={taskFormik.touched.description} error={taskFormik.errors.description} placeholder='Description*' type='text' />
                    <div className='mb-5 mt-10' >
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
                    <div className="flex items-center justify-center gap-5 mt-5" >
                        <Button type="submit" disabled={loading} >
                            Create Task
                        </Button>
                        <Button onClick={closeModal}  >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateTask