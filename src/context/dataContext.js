import createDataContext from "./createDataContext";

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
                user: action.payload.user,
                isAuthenticated: true,
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
        console.error('Somethng went wrong')
    }
}

const fetchUser = dispatch => async () => {
    try {
        const response = await fetch(`${process.env.DOMAIN}/api/user`)
        const resData = await response.json()
        if (resData?.success) {
            dispatch({ type: 'fetch_user', payload: { user: resData?.user } })
        } else {
            throw new Error('User is Unauthorized');
        }
    } catch (err) {
        console.error('Somethng went wrong')
    }
}

export const { Provider, Context } = createDataContext(dataReducer, { authenticate, fetchUser,  }, { user: [], isAuthenticated: false, loading: true })