import {ref, storageRef} from '../config/constants';
const imagesRef = storageRef.child('images/');

export function getSupplies () {
   return ref.collection('supplies')
}

export function addSupply (supply) {
    ref.collection('supplies').add(supply)
       .then(() => {
           console.log('added');
       })
       .catch((e) => {
           console.log(e, 'error');

       }) 
}

export function updateSupply (id,supply) {
    ref.collection('supplies').doc(id).update(supply);
}

export function deleteSupply (id) {
    ref.collection('supplies').doc(id).delete();
}

export function updateSupplyCost (id, cost) {
    ref.collection('supplies').doc(id).update({
        cost,
    })
}

const addImageToDb = (url,id) => {
    ref.collection('supplies').doc(id).update({
        img: url
    })
}

export function uploadImage (file, id) {
    imagesRef.child(file.name).put(file).then((snapshot) => {
        if (snapshot) {
            addImageToDb(snapshot.downloadURL, id);
        }
    });
}
//https://us-central1-trip-keep.cloudfunctions.net/getAmazonList
//http://localhost:5000/trip-keep/us-central1/getAmazonList
export function getWishList (id) {
    return new Promise((resolve,reject) => {
        fetch('https://us-central1-trip-keep.cloudfunctions.net/getAmazonList', {
            method: 'post',
            body: JSON.stringify({id:'246REB9JPYPAZ'})
        }).then((res)=>{
            console.log(res,'res');
            return res.json();
        }).then((data)=>{
            console.log(data,'data');
            resolve(data);
        })
    })
}