import { auth, db, onAuthStateChanged, signOut, getDoc, doc, collection, query, where, getDocs, serverTimestamp, orderBy, storage, ref, uploadBytesResumable, getDownloadURL, deleteDoc, updateDoc, } from "../firebaseConfig.js"
// import {postHandler} from "../Dashboard/app.js"

const userName = document.querySelectorAll('.username')
const userTag = document.querySelectorAll('.userTag')
const logoutBtn = document.querySelector('.logoutBtn')
const postArea = document.querySelector('.postArea')
const postTextArea = document.querySelector('#message-text')
const postBtn = document.querySelector('#postBtn')
const profilePicture = document.querySelector('#profilePic')
const inputPostProfilePic = document.querySelector('#inputPostProfilePic')
const descriptionHtml = document.querySelector('#descriptionHtml')
console.log(profilePicture, "==>> pro pi")
let loggedinUserId;
let profileImage;

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid)
        getUserData(uid)
        loggedinUserId = uid;
    } else {
        console.log(`Sign Out`)
        window.location.href = '../index.html'
    }
});

async function getUserData(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const { firstName, lastName, profilePicture: profilePictureFromDb, description } = docSnap.data()
        console.log(firstName)
        console.log(lastName)
        userName.forEach((name) => {
            name.innerHTML = `${firstName} ${lastName}`
        })
        userTag.forEach((tag) => {
            tag.innerHTML = `@${firstName}`
        })
        profileImage = profilePictureFromDb
        // profilePicture.forEach((pic) => {
        //     pic.src = profilePictureFromDb
        // })
        profilePic.src = profilePictureFromDb
        inputPostProfilePic.src = profilePictureFromDb
        descriptionHtml.textContent = description
    } else {
        console.log("No such document!");
    }
    getMyposts(uid)
}


logoutBtn.addEventListener('click', logoutHandler)
// postBtn.addEventListener('click', postHandler)

function logoutHandler() {
    signOut(auth).then(() => {
        console.log(`Sign-out successful`)
        window.location.href = "../index.html"
    }).catch((error) => {
        console.error(error)
    });
}

async function getMyposts(uid) {
    console.log(uid, "==> uid form get my post function")
    postArea.innerHTML == ``

    // const postsCollectionRef = collection(db, "posts");

    // Create a query to order the documents by "time" field in descending order
    // const sortedQuery = query(postsCollectionRef, orderBy("timestamp", "asc"))

    const q = query(collection(db, "posts"), where("author", "==", uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const { postContent, author, postImageUrl, timestamp } = doc.data()
        console.log(author, "==> author id for query")

        const activeUser = await getAuthData(author)

        let div = document.createElement('div')
        div.setAttribute('class', 'postConatiner postInputContainer mt-3')


        div.innerHTML = `<div class="d-flex justify-content-between ">
    <div class="authorsDetails d-flex align-items-center">
        <div class="post-header-container d-flex align-items-center">
            <div class="image">
                <img src=${profileImage}
                    alt="" class="img-fluid rounded mx-auto d-block">
            </div>
            <div class="userName-id ms-2">
            <p class="mb-1 userTag" style="color: #868686; font-size: 12px;">
            @${activeUser.firstName}</p>
            <div class="d-flex align-items-center justify-content-center">
            <h5 class="mb-1 username">${activeUser.firstName}</h5>
            <p class="mb-0 ms-2" style="color: #ffc107; font-size: 12px;">${timestamp}</p>
            </div>
            </div>
            </div>
            </div>
            <div>
            <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle"
                style="background-color: #282828; border-color: #282828;" type="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>
                <ul class="dropdown-menu" style="background-color: #282828;">
                <li><a class="dropdown-item">Edit</a></li>
                <li><a class="dropdown-item">Delete</a></li>
                </ul>
                </div>
    </div>
</div>
<div class="postDetails">
<p id="post-text" class="mt-2">${postContent}</p>
</div>
<div class="imgBox">
        <img src=${postImageUrl} alt="" id="postImage">
</div>
<div class="like-comment-share d-flex justify-content-start align-items-center mt-3">
<i class="fa-solid fa-heart ms-3 fs-5"></i>
<i class="fa-solid fa-comment ms-3 fs-5"></i>
<i class="fa-solid fa-share ms-3 fs-5"></i>
</div>
<div
class="comment-container d-flex align-items-center mt-3 border-top border-secondary-subtle pt-2">
<div class="image">
<img src=${profileImage}
alt="" class="img-fluid rounded mx-auto d-block">
</div>
<div class="search ps-3 " style="width: 100%;">
<div class="input-group" style="width: 100%;">
<input type="text" class="form-control" placeholder="Write your comment"
aria-label="Example text with button addon" aria-describedby="button-addon1"
id="comment">
<button class="btn " type="button" id="button-addon1" style="background-color: #222;"><i
class="fa-solid fa-paper-plane" style="color: #636363;"></i></button>
</div>
</div>
</div>
</div>`


        postArea.prepend(div)

    });
}

async function getAuthData(id) {
    console.log(id, "==> id for getAuthData")
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log(docSnap.data(), "==> data from getAuthData")
        return docSnap.data()
    } else {
        console.log("No such document!");
    }
}


