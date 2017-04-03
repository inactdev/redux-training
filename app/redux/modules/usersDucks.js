import { fetchUsersDucks } from 'helpers/api'
import { addMultipleDucks } from 'redux/modules/ducks'

// ACTIONS

const FETCHING_USERS_DUCKS = 'FETCHING_USERS_DUCKS'
const FETCHING_USERS_DUCKS_SUCCESS = 'FETCHING_USERS_DUCKS_SUCCESS'
const FETCHING_USERS_DUCKS_ERROR = 'FETCHING_USERS_DUCKS_ERROR'
const ADD_SINGLE_USERS_DUCK = 'ADD_SINGLE_USERS_DUCK'

// REDUCERS

const initialUsersDucksState = {
  isFetching: false,
  error: ''
}

export default function usersDucks (state = initialUsersDucksState, action) {
  switch (action.type) {
    case 'FETCHING_USERS_DUCKS':
      return {
        ...state,
        isFetching: true
      }
    case 'FETCHING_USERS_DUCKS_SUCCESS':
      return {
        ...state,
        isFetching: false,
        error: '',
        [action.uid]: {
          lastUpdated: action.lastUpdated,
          duckIds: action.duckIds
        }
      }
    case 'FETCHING_USERS_DUCKS_ERROR':
      return {
        ...state,
        isFetching: false,
        error: action.error
      }
    case 'ADD_SINGLE_USERS_DUCK':
      return typeof state[action.uid] === 'undefined'
      ? state
      : {
        ...state,
        isFetching: false,
        error: '',
        [action.uid]: usersDuck(state[action.uid], action)
      }
    default:
      return state
  }
}

const initialUsersDuckState = {
  lastUpdated: 0,
  duckIds: []
}

function usersDuck (state = initialUsersDuckState, action) {
  switch (action.type) {
    case 'ADD_SINGLE_USERS_DUCK':
      return {
        ...state,
        duckIds: state.duckIds.concat([action.duckId])
      }
    default:
      return state
  }
}

// ACTION CREATORS

function fetchingUsersDucks (uid) {
  return {
    type: 'FETCHING_USERS_DUCKS',
    uid
  }
}

function fetchingUsersDucksSuccess (uid, duckIds, lastUpdated) {
  return {
    type: 'FETCHING_USERS_DUCKS_SUCCESS',
    uid, 
    duckIds, 
    lastUpdated
  }
}

function fetchingUsersDucksError (error) {
  return {
    type: 'FETCHING_USERS_DUCKS_ERROR',
    error: 'Error fetching users ducks'
  }
}

export function addSingleUsersDuck (uid, duckIds) {
  return {
    type: 'ADD_SINGLE_USERS_DUCK',
    uid,
    duckIds
  }
}

// THUNKS

export function fetchAndHandleUsersDucks (uid) {
  return function (dispatch) {
    dispatch(fetchingUsersDucks())
    fetchUsersDucks(uid)
    .then((ducks) => dispatch(addMultipleDucks(ducks)))
    .then(({ducks}) => dispatch(fetchingUsersDucksSuccess(
        uid, 
        Object.keys(ducks).sort((a, b) => ducks[b].timestamp - ducks[a].timestamp), 
        Date.now()
      )
    ))
    .catch((error) => dispatch(fetchingUsersDucksError(error)))
  }
}
