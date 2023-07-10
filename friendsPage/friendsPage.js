const mainContainer = document.querySelector('.mainContainer');
console.log(mainContainer);

import {app, auth, db, collection, query, where, getDocs} from "../firebaseConfig.js"

async function getAllUser() {
    const q = query(collection(db, "users"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const {firstName, lastName, emailAddress} = doc.data();
        const column = document.createElement('div')
        column.setAttribute('class', 'col');
        const card = `<div class="card" style="width: 18rem; background-color: #282828; color: #fafafa;">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${firstName} ${lastName}</h5>
            <p class="card-text">add to your friend list. <br/>
                Email: ${emailAddress}
            </p>
        </div>
    </div>`
        column.innerHTML = card;
        mainContainer.appendChild(column)
    });

}

getAllUser();