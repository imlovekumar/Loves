(async () => {
    
    // === Utility: Simulate human-like typing ===
    async function simulateMouseInteraction(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;

        const events = ["mouseover", "mouseenter", "mousemove", "mousedown", "mouseup", "click"];

        for (const type of events) {
            const event = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y,
            });
            element.dispatchEvent(event);
            await new Promise(res => setTimeout(res, Math.random() * 60 + 40));
        }
    
    }
    async function typeTextHumanLike(e, text) {
        if (!e || typeof text !== "string") return;

        await simulateMouseInteraction(e);  // Hover + Click
        e.focus();
        e.value = "";
        e.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));

        for (const char of text) {
            e.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true }));
            e.value += char;
            e.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, data: char, inputType: "insertText" }));
            e.dispatchEvent(new KeyboardEvent("keyup", { key: char, bubbles: true }));

            await new Promise(res => setTimeout(res, Math.random() * 100 + 50));
        }

        e.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function addDelay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    // === Utility: Simulate fast & stealthy click ===
    function simulateClick(el) {
        if (!el) return;
        const delay = ms => new Promise(res => setTimeout(res, ms));
        const fire = type => {
            el.dispatchEvent(new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                clientX: el.getBoundingClientRect().left + 1,
                clientY: el.getBoundingClientRect().top + 1
            }));
        };
        return (async () => {
            fire('mouseover');
            await delay(10 + Math.random() * 10);
            fire('mousedown');
            await delay(10 + Math.random() * 15);
            fire('mouseup');
            await delay(5 + Math.random() * 10);
            fire('click');
        })();
    }

    async function solveCaptcha(e = 0) 
    {
        if (e >= 100) return;
        const t = document.querySelector(".captcha-img");
        if (!t || !t.src || t.src.length < 23) return setTimeout(() => solveCaptcha(e + 1), 1e3);
        console.log("Captcha Found !");
        const n = JSON.stringify({  userid: "__userid__",
                                    apikey: "__apikey__",
                                    data: t.src.slice(22)
                                });
        try 
        {
            const r = await fetch("https://api.apitruecaptcha.org/one/gettext", 
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: n
            });
            if (!r.ok) return console.error("Captcha API error:", r.status, r.statusText);
            console.log("Captcha Solved !");
            const {result: a = ""} = await r.json();
            let s = "";
            for (const c of a.replace(/\s/g, "").replace(/[)\]]/g, "J")) "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=@".includes(c) && (s += c);
            const i = document.querySelector("#captcha");
            if (i && s) 
            {   
                console.log("Captcha Typings !");
                await typeTextHumanLike(i, s);
                setTimeout(() => 
                    {
                        const submit = document.querySelector("#review > div.col-lg-9.col-md-9.col-sm-12.remove-padding > form > div.form-group.col-xs-12.hidden-xs > div > button.btnDefault.train_Search");
                        if(submit){
                            console.log("✔ Submit Button Found !");
                            simulateClick(submit);
                            console.log("✍️ Auto Submit !");                            
                        }
                        else {
                            const Log_Btn = document.querySelector("#login_header_disable > div > div > div.ng-tns-c19-13.ui-dialog-content.ui-widget-content > div.irmodal.ng-tns-c19-13 > div > div.login-bg.pull-left > div > div.modal-body > form > span > button");
                            if(!Log_Btn) {
                                console.log("❌ Login Button Not Found !");
                                console.log("✍️ Login Manually ! ");
                            }else {
                            console.log("✔ Login Button Found !");
                            simulateClick(Log_Btn);
                            console.log("✍️ Auto Login !");
                            }
                        }
                    }, 500)
            }
            if (!a) 
            {
                const reloadcap = document.querySelector(".glyphicon.glyphicon-repeat")?.parentElement;
                simulateClick(reloadcap);
                setTimeout(() => solveCaptcha(e + 1), 500)
            }
        } catch (o) { console.error("TrueCaptcha API call failed", o)}
    }
    await solveCaptcha()
})();
