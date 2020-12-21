const socket = io();
const doc = document;
socket.on("message", message =>{
    console.log(message)
})

socket.on("allUsers", users => {
    
    let usrHTML = "";
    if(users.length != 0){
        users.map(usr=> {
            usrHTML += `
                <div class="user_item" data-id="${usr.user_id}">
                    <span class="usrIcon">${usr.nickname.charAt(0)}</span>
                    <div class="usrInfo"> ${usr.nickname} </div>
                    <div class="time"> 11:22 </div>
                </div> `;
        })   
    }
    else{
        usrHTML = `
            <div class="noUserFound">
                <span>No users found!</span>
            </div>`
    }
    
    doc.querySelector(".sideUserCont").innerHTML = usrHTML;
})

socket.on("allMessage", msgs =>{
    let html ="";
    const container = document.querySelector(".messageCont");

    if(msgs.length != 0){
        msgs.reverse().map(msg => {
            html  += `
                <div data-id="${msg.id}" class="msgDiv">
                    <div class="userIcon">
                        <span>
                            {msg.nickname.charAt(0)}
                        </span>
                    </div>
                    <div class="userContent">
                        <h6>{msg.nickname}</h6>
                        <p>${msg.content}</p>
                    </div>
                    
                </div>`;
        })
    } else{
        html += `
            <div>No Message!</div>
        `
    }
    container.innerHTML = html;
})

const formCon = document.querySelector("#sendForm");

formCon.addEventListener("submit", (e) => {

    e.preventDefault();
    const data = serializeForm(formCon);
    socket.emit("sendMessage", data);
    doc.querySelector('textarea[name="content"]').value = "";

})

const serializeForm = (form)=> {
	var obj = {};
	var formData = new FormData(form);
	for (var key of formData.keys()) {
		obj[key] = formData.get(key);
	}
	return obj;
};
