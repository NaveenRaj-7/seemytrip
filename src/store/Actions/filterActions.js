// actions/stationActions.js
import axios from "axios";
import { API_URL, } from "./authActions";

// Action Types
export const FETCH_STATIONS_REQUEST = 'FETCH_STATIONS_REQUEST';
export const FETCH_STATIONS_SUCCESS = 'FETCH_STATIONS_SUCCESS';
export const FETCH_STATIONS_FAILURE = 'FETCH_STATIONS_FAILURE';
export const FETCH_TRAINS_REQUEST = 'FETCH_TRAINS_REQUEST';
export const FETCH_TRAINS_SUCCESS = 'FETCH_TRAINS_SUCCESS';
export const FETCH_TRAINS_FAILURE = 'FETCH_TRAINS_FAILURE';
export const FETCH_TRAINS_SEARCH_PARAMS = 'FETCH_TRAINS_SEARCH_PARAMS';
export const FETCH_TRAINS_FARE_REQUEST = 'FETCH_TRAINS_FARE_REQUEST'
export const FETCH_TRAINS_FARE_SUCCESS = 'FETCH_TRAINS_FARE_SUCCESS'
export const FETCH_TRAINS_FARE_FAILURE = 'FETCH_TRAINS_FARE_FAILURE'
export const FETCH_TRAINS_SCHEDULE_REQUEST = 'FETCH_TRAINS_SCHEDULE_REQUEST'
export const FETCH_TRAINS_SCHEDULE_SUCCESS = 'FETCH_TRAINS_SCHEDULE_SUCCESS'
export const FETCH_TRAINS_SCHEDULE_FAILURE = 'FETCH_TRAINS_SCHEDULE_FAILURE'
export const FETCH_TRAIN_BOARDING_STATIONS_REQUEST = 'FETCH_TRAIN_BOARDING_STATIONS_REQUEST'
export const FETCH_TRAIN_BOARDING_STATIONS_SUCCESS = 'FETCH_TRAIN_BOARDING_STATIONS_SUCCESS'
export const FETCH_TRAIN_BOARDING_STATIONS_FAILURE = 'FETCH_TRAIN_BOARDING_STATIONS_FAILURE'
export const FETCH_IRCTC_USERNAME_REQUEST = 'FETCH_IRCTC_USERNAME_REQUEST'
export const FETCH_IRCTC_USERNAME_SUCCESS = 'FETCH_IRCTC_USERNAME_SUCCESS'
export const FETCH_IRCTC_USERNAME_FAILURE = 'FETCH_IRCTC_USERNAME_FAILURE'
export const FETCH_COUNTRY_LIST_REQUEST = 'FETCH_COUNTRY_LIST_REQUEST'
export const FETCH_COUNTRY_LIST_SUCCESS = 'FETCH_COUNTRY_LIST_SUCCESS'
export const FETCH_COUNTRY_LIST_FAILURE = 'FETCH_COUNTRY_LIST_FAILURE'

// Action Creators
export const fetchStationsRequest = () => ({
  type: FETCH_STATIONS_REQUEST,
});

export const fetchStationsSuccess = (stations) => ({
  type: FETCH_STATIONS_SUCCESS,
  payload: stations,
});

export const fetchStationsFailure = (error) => ({
  type: FETCH_STATIONS_FAILURE,
  payload: error,
});

// Thunk action to fetch stations
export const fetchStations = () => async (dispatch) => {
  dispatch(fetchStationsRequest());
  try {
    const response = await fetch(`${API_URL}/trains/getStation`);
    const data = await response.json();
    console.log(data);
    console.log(`Station Data: ${data}`);
    dispatch(fetchStationsSuccess(data.stations));
  } catch (error) {
    dispatch(fetchStationsFailure(error.toString()));
  }
};


export const fetchTrainsRequest = () => ({
  type: FETCH_TRAINS_REQUEST,
});

export const fetchTrainsSuccess = (trains) => ({
  type: FETCH_TRAINS_SUCCESS,
  payload: trains,
});

export const fetchTrainsFailure = (error) => ({
  type: FETCH_TRAINS_FAILURE,
  payload: error,
});

export const fetchTrainsSearchParams = (searchParams) => ({
  type: FETCH_TRAINS_SEARCH_PARAMS,
  payload: searchParams,
});

// Thunk action to fetch trains based on selected stations

export const fetchTrains = (fromStnCode, toStnCode, journeyDate) => async (dispatch) => {
  dispatch(fetchTrainsRequest());
  localStorage.setItem('loading',true);
  try {
    const response = await fetch(`${API_URL}/trains/getTrains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromStnCode,
        toStnCode,
        journeyDate,
      }),
    });

    const data = await response.json();
    console.log('Request Params:', { fromStnCode, toStnCode, journeyDate });
    console.log('Response Data:', data);
    localStorage.setItem('trains', (data?.trainBtwnStnsList) ?  JSON.stringify(data?.trainBtwnStnsList) : []);
    dispatch(fetchTrainsSuccess(data?.trainBtwnStnsList));
    localStorage.setItem('loading',false);

  } catch (error) {
    console.error(error);
    dispatch(fetchTrainsFailure(error.message));
    localStorage.setItem('loading',false);

  }
};



export const fetchTrainsFareEnqRequest = () => ({
  type: FETCH_TRAINS_FARE_REQUEST,
});

export const fetchTrainsFareEnqSuccess = (trainsFare) => ({
  type: FETCH_TRAINS_FARE_SUCCESS,
  payload: trainsFare,
});

export const fetchTrainsFareEnqFailure = (error) => ({
  type: FETCH_TRAINS_FARE_FAILURE,
  payload: error,
});

// Thunk action to fetch trains fare enquiry
export const fetchTrainsFareEnquiry = (trainNo, fromStnCode, toStnCode, journeyDate, jClass, jQuota, paymentEnqFlag ) => async (dispatch) => { 
  const authToken = localStorage.authToken;
  dispatch(fetchTrainsFareEnqRequest());
  try {
    const response = await fetch(`${API_URL}/trains/getTrains/avlFareEnquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        trainNo,
        fromStnCode,
        toStnCode,
        journeyDate,
        jClass, 
        jQuota, 
        paymentEnqFlag,
      }),
    });

    const data = await response.json();
    console.log('Request Params:', { fromStnCode, toStnCode, journeyDate });
    console.log('Response Data:', data);
    dispatch(fetchTrainsSuccess(data?.trainBtwnStnsList));
  } catch (error) {
    console.error(error);
    dispatch(fetchTrainsFailure(error.message));
  }
}

export const fetchTrainsScheduleRequest = () => ({
  type: FETCH_TRAINS_SCHEDULE_REQUEST,
});

export const fetchTrainsScheduleSuccess = (trainSchedule) => ({
  type: FETCH_TRAINS_SCHEDULE_SUCCESS,
  payload: trainSchedule,
});

export const fetchTrainsScheduleFailure = (error) => ({
  type: FETCH_TRAINS_SCHEDULE_FAILURE,
  payload: error,
});


export const fetchTrainSchedule = (trainNumber) => async (dispatch) => {
  console.log("calling fetch trains 161 from filter actions", trainNumber)
  dispatch(fetchTrainsScheduleRequest());
  try {
    const response = await axios.get(`${API_URL}/trains/getTrainSchedule/${trainNumber}`);
    if(response.data && response.data?.stationList){
      dispatch(fetchTrainsScheduleSuccess(response.data))
    }
  } catch (error) {
    console.error("Error fetching train schedule:", error.message);
    dispatch(fetchTrainsScheduleFailure(error.message));
  }
};



export const fetchTrainBoardingStationsRequest = () => ({
  type: FETCH_TRAIN_BOARDING_STATIONS_REQUEST,
});

export const fetchTrainBoardingStationsSuccess = (trainBoardingStations) => ({
  type: FETCH_TRAIN_BOARDING_STATIONS_SUCCESS,
  payload: trainBoardingStations,
});

export const fetchTrainBoardingStationsFailure = (error) => ({
  type: FETCH_TRAIN_BOARDING_STATIONS_FAILURE,
  payload: error,
});


export const fetchTrainBoardingStations = (trainNumber, journeyDate, fromStnCode, toStnCode, jClass) => 
  async (dispatch) => {
    console.log("Calling fetchTrainBoardingStations with trainNumber:", trainNumber);
    
    dispatch(fetchTrainBoardingStationsRequest());
    try {
      const response = await axios.post(`${API_URL}/trains/getBoardingStations`, {
        trainNumber,
        journeyDate,
        fromStnCode,
        toStnCode,
        jClass,
      });

      if (response.data) {
        console.log("fetchTrainBoardingStationsSuccess:", response.data);
        dispatch(fetchTrainBoardingStationsSuccess(response.data));
      }
    } catch (error) {
      console.error("Error fetching train boarding stations:", error.message);
      dispatch(fetchTrainBoardingStationsFailure(error.message));
    }
  };


  
export const fetchIrctcUsernameRequest = () => ({
  type: FETCH_IRCTC_USERNAME_REQUEST,
});

export const fetchIrctcUsernameSuccess = (IRCTC_username_status) => ({
  type: FETCH_IRCTC_USERNAME_SUCCESS,
  payload: IRCTC_username_status,
});

export const fetchIrctcUsernameFailure = (error) => ({
  type: FETCH_IRCTC_USERNAME_FAILURE,
  payload: error,
});


export const fetchIRCTCusername = (userName) => 
  async (dispatch) => {
    const authToken = localStorage.authToken;
    console.log("Calling fetch IRCTC user name valid or not :", userName);
    
    dispatch(fetchIrctcUsernameRequest());
    try {
      const response = await axios.get(`${API_URL}/trains/getUsernameFromIRCTC/${userName}`, {
        headers : {
          'Authorization': `Bearer ${authToken}`,
        }
      });

      if (response.data) {
        console.log("fetch IRCTC user name is success :", response.data);
        dispatch(fetchIrctcUsernameSuccess(response.data));
      }
    } catch (error) {
      console.error("Error fetching train boarding stations:", error.message);
      dispatch(fetchIrctcUsernameFailure(error.message));
    }
  };


  
export const fetchCountryListRequest = () => ({
  type: FETCH_COUNTRY_LIST_REQUEST,
});

export const fetchCountryListSuccess = (countryList) => ({
  type: FETCH_COUNTRY_LIST_SUCCESS,
  payload: countryList,
});

export const fetchCountryListFailure = (error) => ({
  type: FETCH_COUNTRY_LIST_FAILURE,
  payload: error,
});


export const fetchCountryList = () =>  async (dispatch) => {
    dispatch(fetchCountryListRequest());
    try {
      const countryList = localStorage.getItem('countryList');
      if(countryList){
        dispatch(fetchCountryListSuccess(JSON.parse(countryList)));
      } else {
        const response = await axios.get(`${API_URL}/trains/getCountryList`);
        if (response.data) {
          console.log("fetch country list:", response.data);
          localStorage.setItem('countryList', JSON.stringify(response.data));
          dispatch(fetchCountryListSuccess(response.data));
        }
      }
    } catch (error) {
      console.error("Error fetching train boarding stations:", error.message);
      dispatch(fetchCountryListFailure(error.message));
    }
};