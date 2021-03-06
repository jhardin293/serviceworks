import { combineReducers } from 'redux'

//Reducers
//I just want a reducer that controrls the jobs array
const initState = {
  jobsInt: {
    jobs: [],
    status: 'init'
  },
  jobsByCustomerInt: {
    jobsByCustomer: [],
    status: 'init'
  },
  jobsByEmployeeInt: {
    jobsByEmployee: [],
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
  employeesInt: {
    employees: [],
    status: 'init'
  },
  invoicesInt: {
    invoices: [],
    status: 'init'
  },
  invoicesByCustomerInt: {
    invoicesByCustomer: [],
    status: 'init'
  },
  invoicesCountInt: {
    invoicesCount: 0,
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

const jobsByCustomerReducer = (state = initState.jobsByCustomerInt, action) => {
  switch(action.type) {
    case 'JOB_BY_CUSTOMER':
      return {
        ...state,
        status: action.status,
        jobsByCustomer: action.payload
      }
    default:
      return state;
  }
}

const jobsByEmployeeReducer = (state = initState.jobsByEmployeeInt, action) => {
  switch(action.type) {
    case 'JOB_BY_EMPLOYEE':
      return {
        ...state,
        status: action.status,
        jobsByEmployee: action.payload
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

const employeeReducer = (state = initState.employeesInt, action) => {
  switch(action.type) {
    case 'GET_EMPLOYEES':
      return {
        ...state,
        status: action.status,
        employees: action.payload
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

const invoicesByCustomerReducer = (state = initState.invoicesByCustomerInt, action) => {
  switch(action.type) {
    case 'INVOICES_BY_CUSTOMER':
      return {
        ...state,
        status: action.status,
        invoicesByCustomer: action.payload
      }
    default:
      return state;
  }
}

const invoicesCountReducer = (state = initState.invoicesCountInt, action) => {
  switch(action.type) {
    case 'INVOICES_COUNT':
      return {
        ...state,
        status: action.status,
        invoicesCount: action.payload
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
  user: userReducer,
  employees: employeeReducer,
  jobsByCustomer: jobsByCustomerReducer,
  jobsByEmployee: jobsByEmployeeReducer,
  invoicesByCustomer: invoicesByCustomerReducer,
  invoicesCount: invoicesCountReducer
})

export const rootReducer = (state, action) => {
  if (action.type === 'CLEAR_STORE') {
    state = undefined
  }
  return appReducer(state, action);
}
