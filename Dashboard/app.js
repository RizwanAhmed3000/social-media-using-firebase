// ------------------------Firebase----------------------------//
import { auth, db, onAuthStateChanged, signOut, getDoc, doc} from "../firebaseConfig.js"


const userName = document.querySelectorAll('.username')
const userTag = document.querySelectorAll('.userTag')
const logoutBtn = document.querySelector('.logoutBtn')
const postArea = document.querySelector('.postArea')
const postTextArea = document.querySelector('#message-text')
const myProfileBtn = document.querySelector('.myProfileBtn')
console.log(postTextArea)



onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid)
        getUserData(uid)
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
        const {firstName, lastName} = docSnap.data()
        console.log(firstName)
        console.log(lastName)
        userName.forEach((name)=>{
            name.innerHTML = `${firstName} ${lastName}`
        })
        userTag.forEach((tag)=>{
            tag.innerHTML = `@${firstName}`
        })
    } else {
        console.log("No such document!");
    }

}

logoutBtn.addEventListener('click', logoutHandler)

function logoutHandler() {
    signOut(auth).then(() => {
        console.log(`Sign-out successful`)
        window.location.href = "../index.html"
      }).catch((error) => {
        console.error(error)
      });
}

myProfileBtn.addEventListener('click', () => {
    window.location.href = "../myProfile/index.html"
})


function postHandler() {
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
                    @${activeUser.firstName}</p>
                <div class="d-flex align-items-center justify-content-center">
                    <h5 class="mb-1 username">${activeUser.firstName}</h5>
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
    <p id="post-text" class="mt-2">${postTextArea.value}</p>
</div>
<div class="postImage-video">
    <img src="https://images.unsplash.com/photo-1635016288720-c52507b9a717?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=435&q=80"
        alt="" class="img-fluid" style="object-fit: cover; width: 100%; border-radius: 15px;">
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

    const postObj = {
        userEmail: activeUser.emailAddress,
        post: div.innerHTML,
        date: new Date(),
        time: new Date().toLocaleTimeString()
    }
    activeUserData.unshift(postObj)
    localStorage.setItem('activeUserData', JSON.stringify(activeUserData))
    // console.log(activeUserData)
    // console.log(activeUserData[0].post)
    postTextArea.value = ""

}

// console.log(activeUserData[0])
