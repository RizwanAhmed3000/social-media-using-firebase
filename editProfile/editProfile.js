import { auth, db, onAuthStateChanged, getDoc, doc, storage, setDoc, ref, uploadBytesResumable, getDownloadURL, signOut } from "../firebaseConfig.js"


const firstNameHtml = document.querySelector('#firstName')
const lastNameHtml = document.querySelector('#lastName')
const phoneNumHtml = document.querySelector('#phoneNum')
const editBtn = document.querySelector('#editSubBtn')
const description = document.querySelector('#description')
const profilePicHtml = document.querySelector('#profilePic')
const logoutBtn = document.querySelector('.logoutBtn')
let loggedinUserEmail;
let loggedinUserId;


// console.log(firstName, lastName, phoneNum, description, profilePic)

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        getUserData(uid)
        loggedinUserId = uid
    } else {
        window.location.href = '../index.html'
    }
});

async function getUserData(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const { firstName, lastName, PhoneNumber, emailAddress } = docSnap.data()
        firstNameHtml.value = firstName
        lastNameHtml.value = lastName
        phoneNumHtml.value = PhoneNumber
        loggedinUserEmail = emailAddress
        // description.value ?= description
        

    } else {
        console.log("No such document!");
    }
}





editBtn.addEventListener('click', editProfileHandler);

async function editProfileHandler() {
    console.log(firstNameHtml.value, lastNameHtml.value, description.value, phoneNumHtml.value, profilePicHtml.files[0])

    const file = profilePicHtml.files[0];

    if (file) {
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'profileImages/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log('File available at', downloadURL);
                    await setDoc(doc(db, "users", loggedinUserId), {
                        firstName: firstNameHtml.value,
                        lastName: lastNameHtml.value,
                        PhoneNumber: phoneNumHtml.value,
                        profilePicture: downloadURL,
                        emailAddress: loggedinUserEmail,
                        description: description.value
                    });
                });
            }
        );
    } else {
        await setDoc(doc(db, "users", loggedinUserId), {
            firstName: firstNameHtml.value,
            lastName: lastNameHtml.value,
            PhoneNumber: phoneNumHtml.value,
            emailAddress: loggedinUserEmail,
            description: description.value
        });
    }
}



logoutBtn.addEventListener('click', logoutHandler)

function logoutHandler() {
    signOut(auth).then(() => {
        loggedinUserId = ``
        window.location.href = "../index.html"
    }).catch((error) => {
        console.error(error)
    });
}