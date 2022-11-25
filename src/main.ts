import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

const select_bar = document.getElementById("select_bar");
const ink_el = document.getElementById("ink") as HTMLCanvasElement;

async function greet() {
    if (text)
        await invoke("greet", {
            text: text,
        });
}
appWindow.onFocusChanged(async ({ payload: focused }) => {
    console.log("Focus changed, window is focused? " + focused);
    greet();
    ink_reset();
});

function set_ink_size() {
    ink_el.width = ink_el.parentElement.offsetWidth * 2;
    ink_el.height = ink_el.parentElement.offsetHeight * 2;
}

set_ink_size();
window.onresize = () => {
    set_ink_size();
    ink_reset();
};

var text = "";

var ink_color = "#000";
var mqList = window.matchMedia("(prefers-color-scheme: dark)");
mqList.addEventListener("change", (event) => {
    if (event.matches) {
        ink_color = "#FFF";
    } else {
        ink_color = "#000";
    }
});
let ink_cxt = ink_el.getContext("2d");
let ink_points: [number[], number[]][] = [];
let ink_move = false;
ink_el.onpointerdown = (e) => {
    e.preventDefault();

    ink_points.push([[], []]);
    ink_move = true;

    ink_cxt.beginPath();
    ink_cxt.lineWidth = 3;
    ink_cxt.shadowBlur = 2;
    ink_cxt.strokeStyle = ink_cxt.shadowColor = ink_color;
    ink_cxt.moveTo(e.offsetX * 2, e.offsetY * 2);
};
ink_el.onpointermove = (e) => {
    if (!ink_move) return;
    ink_points[ink_points.length - 1][0].push(e.offsetX);
    ink_points[ink_points.length - 1][1].push(e.offsetY);

    ink_cxt.lineTo(e.offsetX * 2, e.offsetY * 2);
    ink_cxt.stroke();
};
ink_el.onpointerup = () => {
    ink_move = false;

    let data = JSON.stringify({
        options: "enable_pre_space",
        requests: [
            {
                writing_guide: {
                    writing_area_width: ink_el.offsetWidth,
                    writing_area_height: ink_el.offsetHeight,
                },
                ink: ink_points,
                language: "zh_CN",
            },
        ],
    });
    fetch(`https://pem.app/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8`, {
        method: "POST",
        body: data,
        headers: { "content-type": "application/json" },
    })
        .then((v) => v.json())
        .then((v) => {
            console.log(v);
            let text_l = v[1][0][1];
            select_bar.innerHTML = "";
            for (let i in text_l) {
                const t = text_l[i];
                let div = document.createElement("div");
                div.innerText = t;
                if (i == "0") div.classList.add("selected");
                div.onclick = () => {
                    text = t;
                    select_bar.querySelectorAll(".selected").forEach((el) => {
                        el.classList.remove("selected");
                    });
                    div.classList.add("selected");
                };
                select_bar.append(div);
            }
            text = text_l[0];
        });
};
function ink_reset() {
    ink_cxt.clearRect(0, 0, ink_el.width, ink_el.height);
    ink_points = [];
    select_bar.innerHTML = "";
    text = "";
}
