// ==UserScript==
// @name         handwriting
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==
(function () {
    "use strict";
    let main = document.createElement("div");
    main.style.position = "fixed";
    main.style.resize = "both";
    main.style.overflow = "auto";
    main.style.zIndex = "9999999";
    main.style.width = "300px";
    const resizeObserver = new ResizeObserver(() => {
        ink_el.width = ink_el.offsetWidth * 2;
        ink_el.height = ink_el.offsetHeight * 2;
    });
    resizeObserver.observe(main);
    let h = document.createElement("button");
    h.style.width = "16px";
    h.style.height = "16px";
    h.style.position = "absolute";
    h.style.left = "-16px";
    h.style.top = "-16px";
    h.style.pointerEvents = "all";
    let ink_r = document.createElement("div");
    ink_r.style.display = "flex";
    ink_r.style.gap = "4px";
    let ink_el = document.createElement("canvas");
    ink_el.style.width = "100%";
    ink_el.style.height = "100%";
    document.body.append(main);
    main.append(h, ink_r, ink_el);
    var ink_color = "#000";
    var mqList = window.matchMedia("(prefers-color-scheme: dark)");
    mqList.addEventListener("change", (event) => {
        if (event.matches) {
            ink_color = "#FFF";
        } else {
            ink_color = "#000";
        }
    });
    document.addEventListener("pointerup", (e) => {
        if (main.contains(e.target)) return;
        main.style.left = e.clientX + 16 + 4 + "px";
        main.style.top = e.clientY + 16 + 4 + "px";
    });
    let ink_cxt = ink_el.getContext("2d");
    let ink_points = [];
    let ink_move = false;
    var ink_t = {}; // 确保清除所有计时器
    ink_el.onpointerdown = (e) => {
        e.preventDefault();

        ink_points.push([[], []]);
        ink_move = true;

        ink_cxt.beginPath();
        ink_cxt.lineWidth = 3;
        ink_cxt.shadowBlur = 2;
        ink_cxt.strokeStyle = ink_cxt.shadowColor = ink_color;
        ink_cxt.moveTo(e.offsetX * 2, e.offsetY * 2);

        for (let t in ink_t) {
            clearTimeout(Number(t));
            delete ink_t[t];
        }
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
                ink_r.innerHTML = "";
                for (let t of text_l) {
                    let div = document.createElement("div");
                    div.innerText = t;
                    div.onpointerdown = (e) => {
                        e.preventDefault();
                        set_text(t);
                        ink_reset();
                    };
                    ink_r.append(div);
                }
                ink_t[
                    setTimeout(() => {
                        set_text(text_l[0]);
                        ink_reset();
                    }, 1000)
                ] = "";
            });
        function set_text(t) {
            let el = document.activeElement;
            if (!el.selectionStart) return;
            el.setRangeText(t);
            el.selectionEnd += t.length;
            el.dispatchEvent(new Event("input"));
        }
    };
    function ink_reset() {
        for (let t in ink_t) {
            clearTimeout(Number(t));
            delete ink_t[t];
        }
        ink_cxt.clearRect(0, 0, ink_el.width, ink_el.height);
        ink_points = [];
        ink_r.innerHTML = "";
    }

    // Your code here...
})();
