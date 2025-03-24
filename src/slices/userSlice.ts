import { User } from '../interfaces/User';
import { UserState } from '../interfaces/UserState';

// Funções que lidam com a api
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/userService';
import { RootState } from '../store';
import { AuthUser } from '../interfaces/AuthUser';

const initialState: UserState = {
    user: null, // No curso passou como {}
    error: false,
    success: false,
    loading: false,
    message: null,
};

// Get user details
export const  profile = createAsyncThunk<
    User, // Tipo esperado no fulfilled
    void, // Tipo do argumento passado para a função
    { rejectValue: string , state: RootState} // Tipo do rejectWithValue
>(
    "user/profile",
    async(_, thunkAPI) => {

        const authUser = thunkAPI.getState().auth.user as AuthUser;
        
        if (!authUser?.token) {
            return thunkAPI.rejectWithValue("Token JWT não encontrado");
        }
        console.log("T: ", authUser.token);
        const data = await userService.profile(authUser.token);

        return data;

    }
)

// Update user details
export const updateProfile = createAsyncThunk<
    User, // Tipo esperado no fulfilled
    FormData, // Tipo do argumento passado para a função
    { rejectValue: string; state: RootState } // Tipo do rejectWithValue
>(
    "user/update",
    async (formData: FormData, thunkAPI: { rejectWithValue: (value: string) => any; getState: () => RootState }) => { // O tipo de thunkAPI é complexo.
        const authUser = thunkAPI.getState().auth.user as AuthUser;

        if (!authUser?.token) {
            return thunkAPI.rejectWithValue("Token JWT não encontrado");
        }

        const data = await userService.updateProfile(formData, authUser.token);

        if(data.errors){
            return thunkAPI.rejectWithValue(data.errors[0]);
        }

        return data;
    }
);

// get user details

export const getUserDetails = createAsyncThunk<
    User, // Tipo esperado no fulfilled
    string, // Tipo do argumento passado para a função
    { rejectValue: string; state: RootState } // Tipo do rejectWithValue
>(
    "user/get",
    async (id: string, thunkAPI) => { 
        

        const data = await userService.getUserDetails(id);

        if(data.errors){
            return thunkAPI.rejectWithValue(data.errors[0]);
        }

        return data;
    }
);

export const userSlice = createSlice({
    name: "user", initialState, reducers: {
        resetMessage: (state) => {
            state.message = null;
        }
    },

    extraReducers: (builder) => { // Extra reducers lidam com funções assíncronas
        builder
        .addCase(profile.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(profile.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.user = action.payload; // `action.payload` foi definido como `User`
        })
        .addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.user = action.payload; // `action.payload` foi definido como `User`
            state.message = "Usuário atualizado com sucesso!"
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; 
            state.user = null;
        })
        .addCase(getUserDetails.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(getUserDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.user = action.payload; // `action.payload` foi definido como `User`
        });
    }
});

export const { resetMessage } = userSlice.actions;
export default userSlice.reducer;