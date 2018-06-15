import {ref, storageRef} from '../config/constants'
import { store } from '../store'

//WIP
const get = (path, action) => {
  return (dispatch) => {
    let data = []
    ref.collection(path).get().then((snap) => {
      snap.forEach((doc) => {
        data.push(doc.data());
      })
      dispatch({
        type: action,
        payload: data,
        status: 'success'
      })
    })
  }
}


//Jobs
export const getJobs = () => {
  return get('jobs', 'GET_JOBS');
}

export const newJob = (job) => {
  const jobRef = ref.collection('jobs').doc();
  job.id = jobRef.id;

  jobRef.set(job)
    .then((job) => {
      store.dispatch({
        type: 'GET_JOBS',
        status: 'pending',
        payload: store.getState().jobs.jobs
      })
     store.dispatch(getJobs());
    })
}

export const editJob = (job) => {
  const jobRef = ref.collection('jobs').doc(job.id);

  jobRef.update(job)
    .then((job) => {
      store.dispatch({
        type: 'GET_JOBS',
        status: 'pending',
        payload: store.getState().jobs.jobs
      })
     store.dispatch(getJobs());
    })
}

export const deleteJob = (id) => {
  const jobRef = ref.collection('jobs').doc(id);
  jobRef.delete()
    .then(() => {
      store.dispatch({
        type: 'GET_JOBS',
        status: 'pending',
        payload: store.getState().jobs.jobs
      })
     store.dispatch(getJobs());
    })
}


//Notes
export const getNotes = () => {
  return get('notes', 'GET_NOTES');
}

export const newNote = (note) => {
  const noteRef = ref.collection('notes').doc();
  note.id = noteRef.id;

  noteRef.set(note)
    .then((note) => {
      store.dispatch({
        type: 'GET_NOTES',
        status: 'pending',
        payload: store.getState().notes.notes
      })
     store.dispatch(getNotes());
    })
}

export const editNote = (note) => {
  const noteRef = ref.collection('notes').doc(note.id);

  noteRef.update(note)
    .then((note) => {
      store.dispatch({
        type: 'GET_NOTES',
        status: 'pending',
        payload: store.getState().notes.notes
      })
     store.dispatch(getNotes());
    })
}

export const deleteNote = (id) => {
  const noteRef = ref.collection('notes').doc(id);
  noteRef.delete()
    .then(() => {
      store.dispatch({
        type: 'GET_NOTES',
        status: 'pending',
        payload: store.getState().notes.notes
      })
     store.dispatch(getNotes());
    })
}

export const uploadImage = (file, id) => {
  const notesImgRef = storageRef.child('notes/');
  return new Promise((resolve, reject)=>{
    notesImgRef.child(file.name).put(file).then((snapshot) => {
        if (snapshot) {
          const url = snapshot.downloadURL;
          resolve(url);
        }
    });
  });
}


//Customers
export const getCustomers = () => {
  return get('customers', 'GET_CUSTOMERS');
}

export const newCustomer = (customer) => {
  const customerRef = ref.collection('customers').doc();
  customer.id = customerRef.id;

  customerRef.set(customer)
    .then((customer) => {
      store.dispatch({
        type: 'GET_CUSTOMER',
        status: 'pending',
        payload: store.getState().customers.customers
      })
     store.dispatch(getCustomers());
    })
}

export const editCustomer = (customer) => {
  const customerRef = ref.collection('customers').doc(customer.id);

  customerRef.update(customer)
    .then((customer) => {
      store.dispatch({
        type: 'GET_CUSTOMER',
        status: 'pending',
        payload: store.getState().customers.customers
      })
     store.dispatch(getCustomers());
    })
}

export const deleteCustomer = (id) => {
  const customerRef = ref.collection('customers').doc(id);
  customerRef.delete()
    .then(() => {
      store.dispatch({
        type: 'GET_CUSTOMER',
        status: 'pending',
        payload: store.getState().customers.customers
      })
     store.dispatch(getNotes());
    })
}