import toast from "react-hot-toast";
import createDataContext from "./createDataContext";
import { onSignOut } from "@/actions/SignoutAction";

const dataReducer = (state, action) => {
    switch (action.type) {
        case 'authenticate':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false
            }
        case 'fetch_user':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false
            }
        case 'fetch_tasks':
            return {
                ...state,
                tasksData: action.payload,
                loading: false
            }
        case 'set_loading':
            return {
                ...state,
                loading: true
            }
        case 'stop_loading':
            return {
                ...state,
                loading: false
            }
        case 'signout':
            return {
                ...state,
                user: [],
                isAuthenticated: false,
                loading: false
            }
        default:
            return state
    }
}

const authenticate = dispatch => async (data) => {
    try {

        if (data?.success) {
            dispatch({ type: 'authenticate', payload: data?.user })
        } else {
            throw new Error('User is Unauthorized');
        }
    } catch (err) {
        toast.error('Something went wrong')
    }
}

const fetchUser = dispatch => async () => {
    try {
        const response = await fetch(`${process.env.DOMAIN}/api/user`)
        const resData = await response.json()
        if (resData?.success) {
            dispatch({ type: 'fetch_user', payload: resData?.user })
        } else {
            throw new Error('User is Unauthorized');
        }
    } catch (err) {
        dispatch({ type: 'stop_loading' })
        toast.error('Please login to continue')
    }
}

const fetchTasks = dispatch => async () => {
    try {
        const response = await fetch(`${process.env.DOMAIN}/api/tasks`)
        const resData = await response.json()
        if (resData?.success) {
            dispatch({ type: 'fetch_tasks', payload: resData?.tasks })
        } else {
            throw new Error('Tasks not found');
        }
    } catch (err) {
        toast.error('Something went wrong')
    }
}

const createTask = dispatch => async (body) => {
    try {
        const res = await fetch(`${process.env.DOMAIN}/api/createTask`, {
            credentials: "include",
            method: "POST",
            body,
            headers: { 'Content-Type': 'application/json' }
        });
        const resData = await res.json()
        if (resData?.success) {
            dispatch({ type: 'fetch_tasks', payload: resData?.tasks })
            toast.success("Task creation successful")
        } else {
            throw new Error('Task creation failed!!');
        }
    } catch (err) {
        toast.error("Task creation failed")
    }
}

const signOut = dispatch => async () => {    
    try {
        await onSignOut()
        dispatch({ type: 'signout' })
    } catch (err) {
        console.error('Somethng went wrong')
    }
}

export const { Provider, Context } = createDataContext(dataReducer, { authenticate, fetchUser, fetchTasks, createTask, signOut }, { user: [], tasksData: [], isAuthenticated: false, loading: true })