// ------------------------Firebase----------------------------//
import { auth, db, onAuthStateChanged, signOut, getDoc, doc, collection, addDoc, getDocs } from "../firebaseConfig.js"


const userName = document.querySelectorAll('.username')
const userTag = document.querySelectorAll('.userTag')
const logoutBtn = document.querySelector('.logoutBtn')
const postArea = document.querySelector('.postArea')
const postTextArea = document.querySelector('#message-text')
const myProfileBtn = document.querySelector('.myProfileBtn')
const postBtn = document.querySelector('#postBtn')
let loggedinUserId;


onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        getUserData(uid)
        loggedinUserId = uid
    } else {
        window.location.href = '../index.html'
    }
});

createPost()

async function getUserData(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        const { firstName, lastName, PhoneNumber, emailAddress } = docSnap.data()
        userName.forEach((name) => {
            name.innerHTML = `${firstName} ${lastName}`
        })
        userTag.forEach((tag) => {
            tag.innerHTML = `@${firstName}`
        })
    } else {
        console.log("No such document!");
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

myProfileBtn.addEventListener('click', () => {
    window.location.href = "../myProfile/index.html"
})

postBtn.addEventListener('click', postHandler)

function postHandler() {
    storePost();
    createPost()

}

async function storePost() {
    const docRef = await addDoc(collection(db, "posts"), {
        postContent: postTextArea.value,
        author: loggedinUserId,
    });
}

async function createPost() {
    postArea.innerHTML = ``;
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach(async (doc) => {
        // doc.data() is never undefined for query doc snapshots
        const {postContent, author} = doc.data()

        const gettingUserData = await getAuthData(author)

        let div = document.createElement('div')
        div.setAttribute('class', 'postConatiner postInputContainer mt-3')
        div.innerHTML = `<div class="d-flex justify-content-between ">
    <div class="authorsDetails d-flex align-items-center">
        <div class="post-header-container d-flex align-items-center">
            <div class="image">
                <img src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?w=740&t=st=1685543404~exp=1685544004~hmac=d07ea3ce3ef8f3935685c31c8166ad233839e12607dfb08424f2e5a129f3d691"
                    alt="" class="img-fluid rounded mx-auto d-block">
            </div>
            <div class="userName-id ms-2">
                <p class="mb-1 userTag" style="color: #868686; font-size: 12px;">
                    @${gettingUserData?.firstName}</p>
                <div class="d-flex align-items-center justify-content-center">
                    <h5 class="mb-1 username">${gettingUserData?.firstName}</h5>
                    <p class="mb-0 ms-2" style="color: #ffc107; font-size: 12px;">${new Date().toLocaleTimeString()}</p>
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
<div class="like-comment-share d-flex justify-content-start align-items-center mt-3">
    <i class="fa-solid fa-heart ms-3 fs-5"></i>
    <i class="fa-solid fa-comment ms-3 fs-5"></i>
    <i class="fa-solid fa-share ms-3 fs-5"></i>
</div>
<div
    class="comment-container d-flex align-items-center mt-3 border-top border-secondary-subtle pt-2">
    <div class="image">
        <img src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?w=740&t=st=1685543404~exp=1685544004~hmac=d07ea3ce3ef8f3935685c31c8166ad233839e12607dfb08424f2e5a129f3d691"
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
        postTextArea.value = ""
    });
}

async function getAuthData(id){
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        console.log("No such document!");
    }
}