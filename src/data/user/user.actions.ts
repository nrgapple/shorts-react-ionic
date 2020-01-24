import { getUserData, setIsLoggedInData, setUsernameData, setHasSeenTutorialData, setTokenData, setDarkModeData, getCurrentLocation, setLocationData } from '../dataApi';
import { ActionType } from '../../util/types';
import { UserState } from './user.state';
import { GeoPoint } from '../../models/GeoPoint';


export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const data = await getUserData();
  dispatch(setData(data));
  dispatch(setLoading(false));
}

export const loadCurrentLocation = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const point = await getCurrentLocation();
  dispatch(setCurrentLocation({lat: point?point.coords.latitude:0, lng: point?point.coords.longitude:0}));
  dispatch(setLoading(false));
}

export const setLoading = (isLoading: boolean) => ({
  type: 'set-user-loading',
  isLoading
} as const);

export const setData = (data: Partial<UserState>) => ({
  type: 'set-user-data',
  data
} as const);

export const logoutUser = () => async (dispatch: React.Dispatch<any>) => {
  await setIsLoggedInData(false);
  dispatch(setUsername());
};

export const setIsLoggedIn = (loggedIn: boolean) => async (dispatch: React.Dispatch<any>) => {
  await setIsLoggedInData(loggedIn);
  return ({
    type: 'set-is-loggedin',
    loggedIn
  } as const)
};

export const setUsername = (username?: string) => async (dispatch: React.Dispatch<any>) => {
  await setUsernameData(username);
  return ({
    type: 'set-username',
    username
  } as const);
};

export const setCurrentLocation = (point?: GeoPoint) => async (dispatch: React.Dispatch<any>) => {
  await setLocationData(point);
  return ({
    type: 'set-current-location',
    point
  } as const);
};

export const setToken = (token?: string) => async (dispatch: React.Dispatch<any>) => {
  await setTokenData(token);
  return ({
    type: 'set-token',
    token
  } as const);
};

export const setHasSeenTutorial = (hasSeenTutorial: boolean) => async (dispatch: React.Dispatch<any>) => {
  await setHasSeenTutorialData(hasSeenTutorial);
  return ({
    type: 'set-has-seen-tutorial',
    hasSeenTutorial
  } as const);
} 

export const setDarkMode = (darkMode: boolean) => async (dispatch: React.Dispatch<any>) => {
  await setDarkModeData(darkMode);
  return ({
    type: 'set-dark-mode',
    darkMode
  } as const);
}


export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setUsername>
  | ActionType<typeof setToken>
  | ActionType<typeof setHasSeenTutorial>
  | ActionType<typeof setDarkMode>
  | ActionType<typeof setCurrentLocation>
