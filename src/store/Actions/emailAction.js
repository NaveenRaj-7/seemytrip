import axios from 'axios';
import { API_URL } from './authActions';

// Action types
export const SET_OTP_SENT = 'SET_OTP_SENT';
export const SET_OTP_ERROR = 'SET_OTP_ERROR';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_EMAIL_USER = 'SET_EMAIL_USER';
export const LOGOUT_EMAIL_USER = 'LOGOUT_EMAIL_USER';

// Base API URL
// const API_BASE_URL = 'https://tripadmin.onrender.com/api'; // Adjust if needed

// Action to set OTP sent status
export const setOTPSent = (status) => ({
  type: SET_OTP_SENT,
  payload: status,
});

// Action to set OTP error
export const setOTPError = (error) => ({
  type: SET_OTP_ERROR,
  payload: error,
});

// Action to set email
export const setEmail = (email) => ({
  type: SET_EMAIL,
  payload: email,
});

// Action to set email authenticated user
export const setEmailUser = (user, token) => ({
  type: SET_EMAIL_USER,
  payload: { user, token },
});

// Action to send verification OTP
export const sendVerificationOTP = (email) => async (dispatch) => {
  console.log("response from the email action 41 ===>  ",email);
  try {
    dispatch(setOTPError('')); // Clear previous error
    
    const response = await axios.post(`${API_URL}/send-otp`, { email });
    console.log("response from the email action 43 ",response);
    if (response.data) {
      dispatch(setOTPSent(true)); // OTP sent successfully
    }
  } catch (error) {
    console.log("response from the email action 48 ",error);
    const errorMessage = error.response?.data || 'Failed to send OTP';
    dispatch(setOTPError(errorMessage)); // Handle error
  }
};

// Action to verify OTP
export const verifyEmailOTP = (email, otp, navigate) => async (dispatch) => {
  console.log(`Email is => ${email} and OTP is => ${otp} <=== from 58 emailAction`);
  
  try {
    dispatch(setOTPError('')); // Clear previous error

    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });

    if (response.data) {
      const { token, user } = response.data;
      console.log("60 response from the email action ",response.data);
      email = user;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', email); // Store email or user info

      dispatch(setEmail(email))
      dispatch(setEmailUser(email, token));
      // navigate('/');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Invalid or expired OTP';
    dispatch(setOTPError(errorMessage));
  }
};

// export const verifyEmailOTPForgot = (email, otp, navigate) => async (dispatch) => {
//   try {
//     dispatch(setOTPError('')); // Clear previous error

//     const response = await axios.post(`${API_URL}/verify-otp-auth`, { email, otp });

//     if (response.data) {
//       const { token, user } = response.data;
//       console.log("60 response from the email action ",response);
//       email = user;

//       dispatch(setEmail(email))
//       dispatch(setEmailUser(email, token));
//     }
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || 'Invalid or expired OTP';
//     dispatch(setOTPError(errorMessage));
//   }
// };

// Action to log out the email user
export const logoutEmailUser = (navigate) => (dispatch) => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('googleUserName')
  dispatch({ type: LOGOUT_EMAIL_USER });
  if (navigate) {
    navigate('/');
    window.location.reload();
  }
};
