const mainContainer = document.querySelector('.mainContainer');
// console.log(mainContainer);

import { app, auth, db, collection, query, where, getDocs, getDoc, onAuthStateChanged, updateDoc, doc, arrayUnion, arrayRemove, signOut } from "../firebaseConfig.js"

const logoutBtn = document.querySelector('.logoutBtn')
let loggedinUserId;
let myFollowings;

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        getUserData(uid)

        loggedinUserId = uid
    } else {
        window.location.href = '../index.html'
    }
});

logoutBtn.addEventListener('click', logoutHandler)

function logoutHandler() {
    signOut(auth).then(() => {
        loggedinUserId = ``
        window.location.href = "../index.html"
    }).catch((error) => {
        console.error(error)
    });
}

async function getUserData(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const userDataFromDb = docSnap.data()
        // console.log(userDataFromDb.PhoneNumber);
        if (!userDataFromDb.following) {
            const washingtonRef = doc(db, "users", loggedinUserId);
            await updateDoc(washingtonRef, {
                following: arrayUnion(`.`)
            });
            getUserData(uid)
            return;
        } else {
            const { following } = userDataFromDb
            console.log(following, '==>> your followings')
            myFollowings = [...following]
            // console.log(myFollowings, '==>> my followings')
        }

    } else {
        console.log("No such document!");
    }
}

async function getAllUser() {
    mainContainer.innerHTML = ``
    const q = query(collection(db, "users"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        const { firstName, lastName, profilePicture, description, followers, following} = doc.data();
        const column = document.createElement('div')
        column.setAttribute('class', 'card');
        const card = ` <div class = "imageContainer"> <img src=${profilePicture || 'https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?w=740&t=st=1685543404~exp=1685544004~hmac=d07ea3ce3ef8f3935685c31c8166ad233839e12607dfb08424f2e5a129f3d691'}  class="card-img-top usersPp" alt="...">
        </div>
            <div class="card-body">
                <h5 class="card-title">${firstName} ${lastName}</h5>
                <p class="card-text">${description || "No description added"}</p>
                <button type="button" class="btn btn-outline-warning followBtn" onclick = "followHandler('${firstName}', '${doc.id}', '${lastName}')">${followers?.includes(loggedinUserId) ? 'Unfollow' : 'Follow'}</button>
            </div>`
        column.innerHTML = card;
        mainContainer.appendChild(column)
    });

}

getAllUser();

async function followHandler(userFirstName, followingUid, userLastName) {
    console.log(followingUid, '==>> following user uid');
    console.log(loggedinUserId, '==>> logged in user uid');
    const washingtonRef = doc(db, "users", loggedinUserId);
    if (!myFollowings.includes(`${followingUid}`)) {
        await updateDoc(washingtonRef, {
            following: arrayUnion(`${followingUid}`)
        });
        alert(`you are now following ${userFirstName} ${userLastName}`)
        savingFollowersToOtherUser(followingUid, loggedinUserId);
        getUserData(loggedinUserId)
        getAllUser()
        return
    } else {
        await updateDoc(washingtonRef, {
            following: arrayRemove(`${followingUid}`)
        });
        alert(`you have unfollowed ${userFirstName} ${userLastName}`)
        removingFollowersFromOtherUser(followingUid, loggedinUserId)
        getUserData(loggedinUserId)
        getAllUser()
    }
}

async function savingFollowersToOtherUser(followingUid, currentUserUid){
    const washingtonRef = doc(db, "users", followingUid);
    await updateDoc(washingtonRef, {
        followers: arrayUnion(`${currentUserUid}`)
    });
}
async function removingFollowersFromOtherUser(followingUid, currentUserUid){
    const washingtonRef = doc(db, "users", followingUid);
    await updateDoc(washingtonRef, {
        followers: arrayRemove(`${currentUserUid}`)
    });
}

window.followHandler = followHandler;