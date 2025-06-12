( async () => {
    const user_data = {user_data_js};

    function classTranslator(e) 
    {
        let l = "None";
        return e === "1A" ? l = "AC First Class (1A)" 
            : e === "EV" ? l = "Vistadome AC (EV)" 
            : e === "EC" ? l = "Exec. Chair Car (EC)" 
            : e === "2A" ? l = "AC 2 Tier (2A)" 
            : e === "3A" ? l = "AC 3 Tier (3A)" 
            : e === "3E" ? l = "AC 3 Economy (3E)" 
            : e === "CC" ? l = "AC Chair car (CC)" 
            : e === "SL" ? l = "Sleeper (SL)" 
            : e === "2S" ? l = "Second Sitting (2S)" 
            : l, l
    }

    function quotaTranslator(e) 
    {
        let l = "None";
        return e === "GN" ? l = "GENERAL" 
            : e === "TQ" ? l = "TATKAL" 
            : e === "PT" ? l = "PREMIUM TATKAL" 
            : e === "LD" ? l = "LADIES" 
            : e === "SR" ? l = "LOWER BERTH/SR.CITIZEN" 
            : l, l
    }

    function addDelay(ms) { return new Promise(r => setTimeout(r, ms)) }

    function formatDateDMY(s) 
    {
        const d = new Date(s);
        if (isNaN(d)) return "";
        const D = String(d.getDate()).padStart(2, "0"),
              M = String(d.getMonth() + 1).padStart(2, "0"),
              Y = d.getFullYear();
        return `${D}/${M}/${Y}`
    }

    const e = document.querySelector("app-jp-input form");
    if (!e) { alert("Journey form not found!"); return; }

    const t = e.querySelector("#origin > span > input");
    t.value = "__origin__";
    t.dispatchEvent(new Event("keydown"));
    t.dispatchEvent(new Event("input"));
    console.log("Origin :",t.value);
    await addDelay(300);

    const o = e.querySelector("#destination > span > input");
    o.value = "__destination__";
    o.dispatchEvent(new Event("keydown"));
    o.dispatchEvent(new Event("input"));
    console.log("Destination: ",o.value);
    await addDelay(300);

    const r = e.querySelector("#jDate > span > input");
    r.value = user_data.journey_details.date ? formatDateDMY(user_data.journey_details.date) : "";
    r.focus();
    r.dispatchEvent(new Event("keydown"));
    r.dispatchEvent(new Event("input"));
    r.dispatchEvent(new Event("change"));
    r.dispatchEvent(new Event("blur"));
    console.log("Date:",r.value);
    await addDelay(300);

    const a = e.querySelector("#journeyClass");
    a.querySelector("div > div[role='button']").click();
    await addDelay(300);
    const classOption = [...a.querySelectorAll("ul li")].find(el => el.innerText.trim() === classTranslator(user_data.journey_details.class));
    if (classOption) classOption.click();
    console.log("Class:",user_data.journey_details.class);
    await addDelay(300);

    const n = e.querySelector("#journeyQuota");
    n.querySelector("div > div[role='button']").click();
    await addDelay(300);
    const quotaOption = [...n.querySelectorAll("ul li")].find(el => el.innerText.trim() === quotaTranslator(user_data.journey_details.quota));
    if (quotaOption) quotaOption.click();
    console.log("Quota:",user_data.journey_details.quota);
    console.log("Journey Detail Filled !");
    await addDelay(300);

    const l = e.querySelector("button.search_btn.train_Search[type='submit']");
    await addDelay(500);
    if (l) 
    { 
        console.log("🔎 Serach Button Found !");
        l.click();
        console.log("Search Clicked !"); 
    } 
    else alert("Search button not found!");
})();
