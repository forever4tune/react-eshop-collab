import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

type User = {
  id: number;
  name: string;
  email: string;
};

interface AuthState {
  user: User | null;
  token: string | null;
}

const persistedUser = (() => {
  try {
    const raw = localStorage.getItem('auth')
    return raw ? JSON.parse(raw) as AuthState : {user: null, token: null};
  } catch {
    return {user: null, token: null};
  }
})();

const initialState: AuthState = persistedUser;  

const authSlice = createSlice({
  name: 'auth',
  initialState, 
  reducers: {
    loginUser(state, action: PayloadAction<{user: User; token: string}>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('auth', JSON.stringify(state));
    },
    logoutUser(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('auth');
    },
  },
});
export const {loginUser, logoutUser} = authSlice.actions;
export default authSlice.reducer;