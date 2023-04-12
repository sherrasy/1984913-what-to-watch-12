import {AxiosInstance} from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppDispatch, State} from '../../types/state.js';
import {AuthData, UserData} from '../../types/user-auth-data.js';
import { ApiError, ApiRoute, ReducerName } from '../../utils/constants';
import {saveToken, dropToken} from '../../services/token';
import { toast } from 'react-toastify';

export const checkAuth = createAsyncThunk<UserData, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  `${ReducerName.User}/checkAuth`,
  async (_arg, {extra: api}) => {
    const {data} = await api.get<UserData>(ApiRoute.Login);
    return data;
  }
);

export const login = createAsyncThunk<UserData|void, AuthData, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  `${ReducerName.User}/login`,
  async (authData, { extra: api}) => {
    try{ const {data} = await api.post<UserData>(ApiRoute.Login, authData);
      saveToken(data.token);
      return data;}
    catch{
      toast.error(ApiError.Login, {toastId:'login'});
    }
  },
);

export const logout = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  `${ReducerName.User}/logout`,
  async (_arg, { extra: api}) => {

    try{
      await api.delete(ApiRoute.Logout);
      dropToken();
    }
    catch{
      toast.error(ApiError.Logout, {toastId:'logout'});
    }
  },
);
