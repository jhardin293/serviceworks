import { combineReducers } from 'redux'

//Reducers
//I just want a reducer that controrls the jobs array
const initState = {
  jobsInt: {
    jobs: [],
    status: 'init'
  },
  notesInt: {
    notes: [],
    status: 'init'
  },
  customersInt: {
    customers: [],
    status: 'init'
  },
  invoicesInt: {
    invoices: [],
    status: 'init'
  },
  userInt: {
    data: {},
    status: 'init'
  }
}
//So can I genericly call a dispatfh funcition with a string and payload and it automagicaly gets handled by the correct reducer.
//How big does an average reducer get?
//If I cant change the route of the view in the reducer do I change in it in a action or do I have to update the strore so that it is reflected in a a HOC?
const userReducer = (state= initState.userInt, action) => {
  switch(action.type) {
    case 'SET_USER':
      return {
        ...state,
        status: action.status,
        data: action.payload
      }
    case 'GET_USER':
      return {
        ...state,
        status: action.status,
        data: action.payload
      }
    default:
      return state;
  }
}

const jobsReducer = (state = initState.jobsInt, action) => {
  switch(action.type) {
    case 'GET_JOBS':
      return {
        ...state,
        status: action.status,
        jobs: action.payload
      }
    default:
      return state;
  }
}

const notesReducer = (state = initState.notesInt, action) => {
  switch(action.type) {
    case 'GET_NOTES':
      return {
        ...state,
        status: action.status,
        notes: action.payload
      }
    default:
      return state;
  }
}

const customersReducer = (state = initState.customersInt, action) => {
  switch(action.type) {
    case 'GET_CUSTOMERS':
      return {
        ...state,
        status: action.status,
        customers: action.payload
      }
    default:
      return state;
  }
}

const invoicesReducer = (state = initState.invoicesInt, action) => {
  switch(action.type) {
    case 'GET_INVOICES':
      return {
        ...state,
        status: action.status,
        invoices: action.payload
      }
    default:
      return state;
  }
}

const appReducer = combineReducers({
  jobs: jobsReducer,
  notes: notesReducer,
  customers: customersReducer,
  invoices: invoicesReducer,
  user: userReducer
})

export const rootReducer = (state, action) => {
  if (action.type === 'CLEAR_STORE') {
    state = undefined
  }
  return appReducer(state, action);
}
