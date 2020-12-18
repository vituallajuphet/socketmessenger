const socket = io();
const doc = document;
socket.on("message", message =>{
    console.log(message)
})

socket.on("allMessage", msgs =>{
    let html ="";
    const container = document.querySelector(".messageCont");

    msgs.reverse().map(msg => {
        html  += `
            <div data-id="${msg.id}" class="msgDiv">
                <div class="userIcon">
                    <span>
                        ${msg.fname.charAt(0)}
                    </span>
                </div>
                <div class="userContent">
                    <h6>${msg.fname}</h6>
                    <p>${msg.content}</p>
                </div>
                
            </div>`;
        })
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
