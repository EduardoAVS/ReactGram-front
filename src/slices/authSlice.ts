import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";
import { User } from "../interfaces/User";
import { AuthState } from "../interfaces/AuthState";
import { RegisterResponse } from "../interfaces/RegisterResponse";
import { LoginResponse, LoginUser } from "../interfaces/LoginUser";

const user = JSON.parse(localStorage.getItem("user")!)

const initialState: AuthState = {
    user: user ? user : null,
    error: false,
    success: false,
    loading: false,
};

// Register user and sign in

export const register = createAsyncThunk<
    User, // Tipo esperado no fulfilled
    User, // Tipo do argumento passado para a função
    { rejectValue: string } // Tipo do rejectWithValue
>(
    "auth/register",
    async (user, thunkAPI) => {
        try {
            const data: RegisterResponse = await authService.Register(user);
            console.log("DATA REGISTER: ", data);
            if (!data.user) {
                return thunkAPI.rejectWithValue(data.errors?.[0] || "Erro desconhecido");
            }
            console.log("DATA USER: ", data.user);
            return data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue("Erro ao registrar usuário");
        }
    }
);

// Logout user
export const logout = createAsyncThunk<
    void, 
    void, 
    { rejectValue: string } // Mantém o tipo de erro
    >("auth/logout", async () => {
        await authService.Logout();
});

export const login = createAsyncThunk<
    User, 
    LoginUser, 
    { rejectValue: string }
>(
    "auth/login",
    async (user, thunkAPI) => {
        try {

            const data: LoginResponse = await authService.Login(user);
            console.log("DATA: " , data);
            
            if (!data.user) {
                return thunkAPI.rejectWithValue(data.errors?.[0] || "Erro desconhecido");
            }
            
            return data.user as User; // Força a ser do tipo User.
        } catch (error) {
            
            return thunkAPI.rejectWithValue("Erro ao fazer login");
        }
    }
);




export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false;
            state.error = false;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
                state.user = action.payload; // `action.payload` foi definido como `User`
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string; 
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.success = true;
                state.user = null; 
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
                state.user = action.payload; // `action.payload` foi definido como `User`
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string; 
                state.user = null;
            });
    }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;