import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

//user fetch
interface User {
    _id: string
    email: string;
    createdAt: string
    updatedAt: string
}

interface fetchUser extends User {
    user: User
    token: string
}
//threath interface
interface Entry {
    description: string;
    _id: string;
    createdAt: string
    updatedAt: string
    owner?: string;
    __v: number
}

interface Threat {
    _id: string;
    name: string;
    entries: Entry[];
}

//
//normal ouser state
interface userState {
    user: string
    token: string
    threats: Threat[];
}

const initialState: userState = {
    user: "",
    token: "",
    threats: [],
};

export const fetchThreats = createAsyncThunk<Threat[], void>('user/fetchThreats', async () => {
    const response = await fetch('http://localhost:3000/threats');
    if (!response.ok) {
        throw new Error('Failed to fetch threats');
    }
    const res = await response.json() as Threat[]

    
    return res
});


export const login = createAsyncThunk<{ user: string, token: string }, { email: string, password: string }>('user/login', async (credentials) => {
    const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }

    const res = await response.json() as fetchUser;


    localStorage.setItem('token', res.token);
    localStorage.setItem('user', res.user.email);
    // Optionally, save the token to localStorage or any other storage here if needed.
    // e.g. localStorage.setItem('auth_token', res.token);
    const user = res.user.email
    const token = res.token

    return { user: user, token: token };
});

// ... (rest of the imports and initial state)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Set the payload type of setUser to UserToken
        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        clearUser: (state) => {
            state.user = ""
            state.token = ""
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        // Set the payload type of loginHandler to UserToken
        loginHandler: (state, action: PayloadAction<any>) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },

        logoutHandler: (state) => {
            state.user = ""
            state.token = ""
            state.threats = [];
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        cookieHandler: (state, action: PayloadAction<any>) => {
            // Implement the action based on your requirements
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            // Update the state with the user data
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(fetchThreats.fulfilled, (state, action) => {
            // Update the state with the fetched threats
            state.threats = action.payload;
        });
    }
});


export const {
    setUser,
    clearUser,
    loginHandler,
    logoutHandler,
    cookieHandler,
} = userSlice.actions;

export default userSlice.reducer;
