const firstName = document.querySelector('#first-name')
const lastName = document.querySelector('#last-name')
const newPassword = document.querySelector('#new-password')
const password = document.querySelector('#password')
const dateOfBirth = document.querySelector('#dateOfBirth')
const emailAddress = document.querySelector('#email-address')
const email = document.querySelector('#email')
const phoneNumber = document.querySelector('#phoneNumber')
const passwordWarning = document.querySelector('.passwordWarning')
const passwordBtn = document.querySelector('.passwordBtn')
const creatAcctountBtn = document.querySelector('#creatAcctountBtn')
const loginBtn = document.querySelector('#loginBtn')
let gender;


// ------------------------Firebase connections-----------------------------------//

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDy0DBhbfPgJ3X0Gl3GGcuruxywWorAuxQ",
    authDomain: "social-media-app-3000.firebaseapp.com",
    projectId: "social-media-app-3000",
    storageBucket: "social-media-app-3000.appspot.com",
    messagingSenderId: "521872056341",
    appId: "1:521872056341:web:8cdacf616b38650f12ee1c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


creatAcctountBtn.addEventListener('click', signupHandler)
loginBtn.addEventListener('click', loginHandler)

passwordWarning.style.visibility = "hidden"

function showHide(p) {
    if (p.type == "password") {
        p.setAttribute('type', 'text')
        passwordBtn.classList.add('active')
    } else {
        p.setAttribute('type', 'password')
        passwordBtn.classList.remove('active')
    }
}

function loginHandler() {
    signInWithEmailAndPassword(auth, email.value , password.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            if(user){
                window.location.href = '../Dashboard/index.html'
            }
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
}


function signupHandler() {

    createUserWithEmailAndPassword(auth, emailAddress.value, newPassword.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user)
            if (user) {
                addUserHandler(user.uid)
                emptyInput()
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode)
            console.error(errorMessage)
        });
}


function genderHandler(g) {
    gender = g
}

function emptyInput() {
    firstName.value = ""
    lastName.value = ""
    emailAddress.value = ""
    phoneNumber.value = ""
    newPassword.value = ""
    dateOfBirth.value = ""
    dateOfBirth.value = ""
    gender = ""

}

async function addUserHandler(uid) {
    try {
        const response = await setDoc(doc(db, "users", uid), {
            firstName: firstName.value,
            lastName: lastName.value,
            PhoneNumber: phoneNumber.value,
            emailAddress: emailAddress.value,
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}