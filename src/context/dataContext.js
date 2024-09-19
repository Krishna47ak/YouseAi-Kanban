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

export const { Provider, Context } = createDataContext(dataReducer, { authenticate,  }, { user: [], isAuthenticated: false, loading: false })