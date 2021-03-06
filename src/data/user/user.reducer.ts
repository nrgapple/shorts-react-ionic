import { UserActions } from './user.actions';
import { UserState } from './user.state';

export function userReducer(state: UserState, action: UserActions): UserState {
  switch (action.type) {
    case 'set-user-loading':
      return { ...state, loading: action.isLoading };
    case 'set-user-data':
      return { ...state, ...action.data };
    case 'set-username':
      return { ...state, username: action.username };
    case 'set-token':
      return { ...state, token: action.token };
    case 'set-has-seen-tutorial':
      return { ...state, hasSeenTutorial: action.hasSeenTutorial };
    case 'set-dark-mode':
      return { ...state, darkMode: action.darkMode };
    case 'set-is-loggedin':
      return { ...state, isLoggedin: action.loggedIn };
    case 'set-is-client-connected':
      return { ...state, isClientConnected: action.connected };
    case 'set-client':
      return { ...state, client: action.client };
    case 'set-current-location':
      return { ...state, location: action.point};
    case 'set-visibility':
      return { ...state, visibility: action.visibility };
  }
}