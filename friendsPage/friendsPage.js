const mainContainer = document.querySelector('.mainContainer');
// console.log(mainContainer);

import { app, auth, db, collection, query, where, getDocs, onAuthStateChanged, updateDoc, doc } from "../firebaseConfig.js"

let loggedinUserId;

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        // getUserData(uid)
        loggedinUserId = uid
    } else {
        window.location.href = '../index.html'
    }
});

async function getAllUser() {
    const q = query(collection(db, "users"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        const { firstName, lastName, emailAddress, profilePicture, description, PhoneNumber} = doc.data();
        const column = document.createElement('div')
        column.setAttribute('class', 'card');
        const card = ` <div class = "imageContainer"> <img src=${profilePicture || 'https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?w=740&t=st=1685543404~exp=1685544004~hmac=d07ea3ce3ef8f3935685c31c8166ad233839e12607dfb08424f2e5a129f3d691'}  class="card-img-top usersPp" alt="...">
        </div>
            <div class="card-body">
                <h5 class="card-title">${firstName} ${lastName}</h5>
                <p class="card-text">${description || "No description added"}</p>
                <button type="button" class="btn btn-outline-warning followBtn" onclick = "followHandler('${firstName}', '${doc.id}', '${lastName}', '${profilePicture}', '${description}', '${emailAddress}', '${PhoneNumber}')">Follow</button>
            </div>`
        column.innerHTML = card;
        mainContainer.appendChild(column)
    });

}

getAllUser();

async function followHandler(userFirstName, followingUid, userLastName, profilePicture, description, emailAddress, PhoneNumber ){
    // console.log('working....')
    console.log(userFirstName, followingUid, userLastName, profilePicture, description, emailAddress, PhoneNumber);
    console.log(loggedinUserId, "==>> logged in user");
    const washingtonRef = doc(db, "users", followingUid);

    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
        followers: loggedinUserId
    });
}

window.followHandler = followHandler;