import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};

export const authSucess = (token,userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken : token,
		userId : userId
	};
};

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	};
};

export const logout = () => {
	return {
		type : actionTypes.AUTH_LOGOUT
	}
}

export const checkAuthTimeout = (expirationTime) => {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout());
		}, expirationTime);
	}
}

export const auth = (email, password, isSignup ) => {
	return (dispatch) => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true
		};
		let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD5J9zyMK3oZw9N708ziabfCxQvH6qoo1g';
		if(!isSignup) {
			url =  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD5J9zyMK3oZw9N708ziabfCxQvH6qoo1g'
		}
		axios
			.post(
				url,
				authData
			)
			.then((response) => {
				console.log(response);
				console.log('tempo para expirar --->',response.data.expiresIn)
				dispatch(authSucess(response.data.idToken, response.data.localId));
				dispatch(checkAuthTimeout(response.data.expiresIn * 1000));
			})
			.catch((err) => {
				console.log(err);
				dispatch(authFail(err.response.data.error));
			});
	};
};
