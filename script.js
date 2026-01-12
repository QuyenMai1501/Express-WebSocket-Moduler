const HOST = "192.168.20.141:9999";

let ws;

async function loadHistory() {
    const t = token.value.trim();
    const res = await fetch(`http://${HOST}/api/chat/messages`, {
        headers: {Authorization: `Bearer ${t}`},
    });

    const json = await res.json();

    box.innerHTML = "";

    for (const m of json.data) {
        box.innerHTML += `<div>${m.userEmail}: ${m.text}</div>`
    }
}

function connect() {
    const t = token.value.trim();
    loadHistory();
    ws = new WebSocket(`ws://${HOST}/ws?token=${encodeURIComponent(t)}`);

    ws.onmessage = (e) => {
        const m = JSON.parse(e.data);
        if (m.type === "message") {
            box.innerHTML += `<div>${m.data.userEmail}: ${m.data.text}</div>`
        }
    };
}



function send() {
    ws.send(JSON.stringify({type: "message", text: text.value}));
    text.value = "";
}