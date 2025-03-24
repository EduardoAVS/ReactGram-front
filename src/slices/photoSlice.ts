import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import photoService from '../services/photoService';
import { PhotoState } from '../interfaces/PhotoState';
import { RootState } from '../store';
import { Photo } from '../interfaces/Photo';
import { AuthUser } from '../interfaces/AuthUser';
import { Comment } from '../interfaces/Photo';

const initialState: PhotoState = {
    photos: [],
    photo: null,
    error: false,
    success: false,
    loading: false,
    message: null,
}

// publish user photo
export const publishPhoto = createAsyncThunk<
    Photo, // Tipo esperado no fulfilled
    FormData, // Tipo do argumento passado para a função
    { rejectValue: string , state: RootState} // Tipo do rejectWithValue
>(
    "photo/publish",

    async(photo: FormData, thunkAPI) => {

        const authUser = thunkAPI.getState().auth.user as AuthUser;
                
        if (!authUser?.token) {
            return thunkAPI.rejectWithValue("Token JWT não encontrado");
        }

        const data = await photoService.publishPhoto(photo, authUser.token);

        if(data.errors){
            return thunkAPI.rejectWithValue(data.errors[0]);
        }

        return data;
    }
);

// Get user photos
export const getUserPhotos = createAsyncThunk<
    Photo[], // Tipo esperado no fulfilled
    string, // Tipo do argumento passado para a função
    { rejectValue: string , state: RootState} // Tipo do rejectWithValue
>(
    "photo/userphotos",
    async(id: string, thunkAPI) => {

        const authUser = thunkAPI.getState().auth.user as AuthUser;
                
        if (!authUser?.token) {
            return thunkAPI.rejectWithValue("Token JWT não encontrado");
        }

        const data = await photoService.getUserPhotos(id, authUser.token);

        if(data.errors){
            return thunkAPI.rejectWithValue(data.errors[0]);
        }
        
        return data;


    } 
)

// Delete Photo

export const deletePhoto = createAsyncThunk<
    Photo,
    string,
    { rejectValue: string , state: RootState}
>(
    "photo/deletephoto",
    async(id: string, thunkAPI) => {
        
    const authUser = thunkAPI.getState().auth.user as AuthUser;
            
    if (!authUser?.token) {
        return thunkAPI.rejectWithValue("Token JWT não encontrado");
    }

    const data = await photoService.deletePhoto(id, authUser.token);
    
    return data;


    } 
)

// Update photo

export const updatePhoto = createAsyncThunk<
Photo, // Tipo esperado no fulfilled
{ title: string; id: string }, // Tipo do argumento passado para a função
{ rejectValue: string , state: RootState} // Tipo do rejectWithValue
>(
"photo/update",

async({ title, id} , thunkAPI) => {

    const authUser = thunkAPI.getState().auth.user as AuthUser;
            
    if (!authUser?.token) {
        return thunkAPI.rejectWithValue("Token JWT não encontrado");
    }

    const data = await photoService.updatePhoto( { title }, id, authUser.token);

    if(data.errors){
        return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
}
);

// get photo by id
export const getPhoto = createAsyncThunk<
Photo,
string,
{ rejectValue: string , state: RootState}
>(
    "photo/getphoto",
    async(id: string, thunkAPI) => {

        const authUser = thunkAPI.getState().auth.user as AuthUser;
            
        if (!authUser?.token) {
            return thunkAPI.rejectWithValue("Token JWT não encontrado");
        }


        const data = await photoService.getPhoto(id, authUser.token);

        return data;
    }
)

// like photo
export const like = createAsyncThunk<
Photo,
string,
{ rejectValue: string , state: RootState}
>(
    "photo/like",
    async(id: string, thunkAPI) => {

        const authUser = thunkAPI.getState().auth.user as AuthUser;
            
        if (!authUser?.token) {
            return thunkAPI.rejectWithValue("Token JWT não encontrado");
        }


        const data = await photoService.like(id, authUser.token);

        if(data.errors){
            return thunkAPI.rejectWithValue(data.errors[0]);
        }
        
        return data;
    }
)

export const comment = createAsyncThunk<
    Comment,
    { comment: string; photoId: string },
    { rejectValue: string, state: RootState }
>(
    "photo/comment",
    async (commentData, thunkAPI) => {
        const authUser = thunkAPI.getState().auth.user as AuthUser;

        if (!authUser?.token) {
            return thunkAPI.rejectWithValue("Token JWT não encontrado");
        }

        const data = await photoService.comment({
            comment: commentData.comment,
            userName: authUser.name as string,
            userId: authUser._id as string,
        },
        commentData.photoId,
        authUser.token);

        if (data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0]);
        }

        // Retorna apenas o comentário recebido
        return data;
    }
);

// Get All Photos
export const getAllPhotos = createAsyncThunk<
  Photo[],
  void, 
  { rejectValue: string; state: RootState }
>(
  "photo/getall",
  async (_, { getState, rejectWithValue }) => { // O primeiro argumento é omitido com "_"
    const authUser = getState().auth.user as AuthUser;

    if (!authUser?.token) {
      return rejectWithValue("Token JWT não encontrado");
    }

    const data = await photoService.getAllPhotos(authUser.token);
    return data;
  }
);

// Search photo by title
export const searchPhotos = createAsyncThunk<
  Photo[],
  string, 
  { rejectValue: string; state: RootState }
>(
  "photo/search",
  async (query: string, thunkAPI) => { 

    const authUser = thunkAPI.getState().auth.user as AuthUser;

    if (!authUser?.token) {
      return thunkAPI.rejectWithValue("Token JWT não encontrado");
    }

    const data = await photoService.searchPhotos(query, authUser.token);
    console.log("SLICE: ", data);

    return data;
  }
);



export const photoSlice = createSlice({
    name: "photo",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null;
        },
    },

    extraReducers: (builder) => { // Extra reducers lidam com funções assíncronas
        builder
        .addCase(publishPhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(publishPhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.photo = action.payload;
            if(state.photo){
                state.photos.unshift(state.photo);
            }
            state.message = "Foto publicada com sucesso"
        })
        .addCase(publishPhoto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; 
            state.photo = null;
        })
        .addCase(getUserPhotos.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(getUserPhotos.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.photos = action.payload;
            
        })
        .addCase(deletePhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(deletePhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.photos = state.photos.filter((photo) => {
                return photo._id !== action.payload._id;          
            })
            state.message = "Foto removida com sucesso!"
        })
        .addCase(deletePhoto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; 
            state.photo = null;
        })
        .addCase(updatePhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(updatePhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.photo = action.payload;
           
            const updatedPhoto = state.photos.find(photo => photo._id === action.payload._id);
            if (updatedPhoto) {
                updatedPhoto.title = action.payload.title;
            }

            state.message = "Foto atualizada com sucesso"
        })
        .addCase(updatePhoto.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; 
            state.photo = null;
        })
        .addCase(getPhoto.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(getPhoto.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.photo = action.payload;
            
        })
        .addCase(like.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
        
            // Verificar se likes existe na foto e inicializar se necessário
            if (state.photo) {
                if (!state.photo.likes) {
                    state.photo.likes = []; 
                }
                state.photo.likes.push(action.payload.userId); // Adiciona o userId
            }
        
            // Atualizar foto dentro de 'photos' (se for uma foto diferente)
            state.photos.map((photo) => {
                if (photo._id === action.payload._id) {
                    return photo.likes.push(action.payload.userId);
                }
                return photo;
            });
        
            state.message = "Foto curtida com sucesso";
        })
        
        .addCase(like.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; 
            state.photo = null;
        })
        .addCase(comment.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
        
            if (state.photo) {
                if (!state.photo.comments) {
                    state.photo.comments = []; 
                }
                state.photo.comments.push(action.payload);            }
        
            state.message = "Comentário adicionado!";
        })
        
        .addCase(comment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string; 
            state.photo = null;
        })
        .addCase(getAllPhotos.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(getAllPhotos.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.photos = action.payload;
            
        })
        .addCase(searchPhotos.pending, (state) => {
            state.loading = true;
            state.error = false;
        })
        .addCase(searchPhotos.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.photos = action.payload;
            
        });
    }
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;