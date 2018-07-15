import { ref, storageRef } from '../config/constants'
import { store } from '../store'

//User
export const setUser = (user) => {
  const convertListofCustomObjects = (list) => {
    return list.map((custObj) => {
      return { ...custObj };
    })
  }

  const userRef = ref.collection('/users').doc(user.uid)

  const userObj = {
    displayName: user.displayName,
    email: user.email,
    company: user.company || '',
    address: user.address || '',
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    providerData: convertListofCustomObjects(user.providerData),
    uid: user.uid
  }

  ref.runTransaction((transaction) => {
    return transaction.get(userRef).then((userDoc) => {
      const existingUser = userDoc.data();
      if (!userDoc.exists) {
        userRef.set(userObj);
      } else {
        transaction.update(userRef, existingUser);
        store.dispatch({
          type: 'SET_USER',
          payload: existingUser,
        })
      }

    })
  })
}


export const getUser = () => {
  const user = store.getState().user.data;
  if (user.uid) {
    const userRef = ref.collection('/users').doc(user.uid)
    return (dispatch) => {
      userRef.get().then((snap) => {
        dispatch({
          type: 'GET_USER',
          payload: snap.data(),
        })
      });
    }
  } else {
    return (dispatch) => {
      dispatch({
        type: 'GET_USER',
        payload: user,
      })
    }
  }
}

export const updateUser = (user) => {
  const userRef = ref.collection('/users').doc(user.uid)
  userRef.update(user).then(() => {
    store.dispatch(getUser());
  });
}

const get = (path, action) => {
  const user = store.getState().user.data;
  return (dispatch) => {
    let data = []
    ref.collection(path).where("author", "==", user.uid).get().then((snap) => {
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

const post = (item, path, action, getData) => {
  const itemRef = ref.collection(path).doc();
  const user = store.getState().user.data;
  item.id = itemRef.id;
  item.author = user.uid;

  itemRef.set(item)
    .then((item) => {
      store.dispatch({
        type: action,
        status: 'pending',
        payload: store.getState()[path][path]
      })
      if (getData) {
        store.dispatch(getData());
      }
    })
}

const update = (item, path, action, getData) => {
  const itemRef = ref.collection(path).doc(item.id);
  const user = store.getState().user.data;
  item.author = user.uid;

  itemRef.set(item)
    .then((item) => {
      store.dispatch({
        type: action,
        status: 'pending',
        payload: store.getState()[path][path]
      })
      if (getData) {
        store.dispatch(getData());
      }
    })
}

const remove = (id, path, action, getData) => {
  const itemRef = ref.collection(path).doc(id);

  itemRef.delete()
    .then(() => {
      store.dispatch({
        type: action,
        status: 'pending',
        payload: store.getState()[path][path]
      })
      if (getData) {
        store.dispatch(getData());
      }
    })
}


//Clear Redux store(used in logout)
export const clearStore = () => {
  store.dispatch({
    type: 'CLEAR_STORE'
  })
}


//Jobs
export const getJobs = () => {
  return get('jobs', 'GET_JOBS');
}

export const newJob = (job) => {
  post(job, 'jobs', 'GET_JOBS', getJobs);
}

export const editJob = (job) => {
  update(job, 'jobs', 'GET_JOBS', getJobs);
}

export const deleteJob = (id) => {
  remove(id, 'jobs', 'GET_JOBS', getJobs);
}


//Notes
export const getNotes = () => {
  return get('notes', 'GET_NOTES');
}

export const newNote = (note) => {
  post(note, 'notes', 'GET_NOTES', getNotes);
}

export const editNote = (note) => {
  update(note, 'notes', 'GET_NOTES', getNotes);
}

export const deleteNote = (id) => {
  remove(id, 'notes', 'GET_NOTES', getNotes);
}

export const uploadImage = (path,file) => {
  const imgRef = storageRef.child(path);
  return new Promise((resolve, reject) => {
    imgRef.child(file.name).put(file).then((snapshot) => {
      if (snapshot) {
        snapshot.ref.getDownloadURL().then((url)=> {
          resolve(url);
        })
      }
    });
  });
}


//Customers
export const getCustomers = () => {
  return get('customers', 'GET_CUSTOMERS');
}

export const newCustomer = (customer) => {
  post(customer, 'customers', 'GET_CUSTOMERS', getCustomers);
}

export const editCustomer = (customer) => {
  update(customer, 'customers', 'GET_CUSTOMERS', getCustomers);
}

export const deleteCustomer = (id) => {
  remove(id, 'customers', 'GET_CUSTOMERS', getCustomers);
}

//Employee
export const getEmployees = () => {
  return get('employees', 'GET_EMPLOYEES');
}

export const newEmployee  = (employee) => {
  post(employee, 'employees', 'GET_EMPLOYEES', getEmployees);
}

export const editEmployee  = (employee) => {
  update(employee, 'employees', 'GET_EMPLOYEES', getEmployees);
}

export const deleteEmployee  = (id) => {
  remove(id, 'employees', 'GET_EMPLOYEES', getEmployees);
}

//Invoices
export const getInvoices = () => {
  return get('invoices', 'GET_INVOICES');
}

export const newInvoice = (invoice) => {
  post(invoice, 'invoices', 'GET_INVOICES', getInvoices);
}

export const editInvoice = (invoice) => {
  update(invoice, 'invoices', 'GET_INVOICES', getInvoices);
}

export const deleteInvoice = (id) => {
  remove(id, 'invoices', 'GET_INVOICES', getInvoices);
}