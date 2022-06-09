export async function getMessages() {
    const messages = await webix.ajax().get("http://localhost:8089/api/getallmessages")
        .then(response => response.json());
    return messages;
}

export async function getMessage(id) {
    const message = await webix.ajax().get(`http://localhost:8089/api/getmessage/${id}`)
        .then(response => {
            const data = response.json();
            data.onchange = true;
            return data;
        });
    return message;
}

export async function delMessage(id) {
    await webix.ajax().del(`http://localhost:8089/api/deletemessage/${id}`)
    return;
}

export async function setMessage(message) {
    await webix.ajax()
        .headers({"Content-Type": "application/json"})
        .put("http://localhost:8089/api/putmessage",  message);
    return;
}

export async function getNewId() {
    const id = await webix.ajax().get("http://localhost:8089/api/getnewid")
        .then(response => {
            const id = response.json();
            return id;
        });
    return id;
}