const HOST = "192.168.1.11:9999";

let ws;

async function loadHistory() {
    const t = token.value.trim();
    // default public; client can set scope and with via query when calling server
    const scope = document.querySelector('input[name="scope"]:checked').value;
    const recipientEmail = recipient.value.trim();
    let url = `http://${HOST}/api/chat/messages?scope=${encodeURIComponent(scope)}`;
    if (scope === "private" && recipientEmail) {
        // server listing private messages uses 'with' userId; if client only has email you'd call a users API to get id.
        // here we attempt to pass recipientEmail for server side to handle if implemented.
        url += `&with=${encodeURIComponent(recipientEmail)}`;
    }
    const res = await fetch(url, {
        headers: {Authorization: `Bearer ${t}`},
    });

    const json = await res.json();

    box.innerHTML = "";

    for (const m of json.data) {
        box.innerHTML += `<div>${m.userEmail}: ${m.text}${m.isPublic ? '' : ' (private)'}</div>`
    }
}

function connect() {
    const t = token.value.trim();
    loadHistory();
    ws = new WebSocket(`ws://${HOST}/ws?token=${encodeURIComponent(t)}`);

    ws.onmessage = (e) => {
        const m = JSON.parse(e.data);
        if (m.type === "message") {
            box.innerHTML += `<div>${m.data.userEmail}: ${m.data.text}${m.data.isPublic ? '' : ' (private)'}</div>`
        }
    };
}



function send() {
    const scope = document.querySelector('input[name="scope"]:checked').value;
    const recipientEmail = recipient.value.trim();
    ws.send(JSON.stringify({
        type: "message",
        text: text.value,
        isPublic: scope === "public",
        recipientEmail: recipientEmail || undefined
    }));
    text.value = "";
}