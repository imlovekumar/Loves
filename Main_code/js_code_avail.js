(() => {
    
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function simulateMouseMove(element) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const startX = rect.left + rect.width / 2 + (Math.random() * 20 - 10);
        const startY = rect.top + rect.height / 2 + (Math.random() * 20 - 10);
        const endX = rect.left + rect.width / 2;
        const endY = rect.top + rect.height / 2;
        const steps = 8 + Math.floor(Math.random() * 8);
        for (let i = 0; i <= steps; i++) {
            const x = startX + ((endX - startX) * i / steps) + (Math.random() * 2 - 1);
            const y = startY + ((endY - startY) * i / steps) + (Math.random() * 2 - 1);
            const moveEvent = new MouseEvent("mousemove", {
                bubbles: true, cancelable: true, view: window, clientX: x, clientY: y
            });
            element.dispatchEvent(moveEvent);
            await sleep(10 + Math.random() * 20);
        }
    }

    async function simulateClick(element) {
        if (!element) return console.warn("simulateClick called with null element");
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        await sleep(150 + Math.random() * 100);
        await simulateMouseMove(element);
        try { element.focus?.(); } catch (e) {}
        await sleep(80 + Math.random() * 70);
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window, clientX: centerX, clientY: centerY, button: 0 }));
        await sleep(40 + Math.random() * 60);
        element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true, view: window, clientX: centerX, clientY: centerY, button: 0 }));
        await sleep(40 + Math.random() * 60);
        element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window, clientX: centerX, clientY: centerY, button: 0 }));
    }

    async function logic() 
    {
        const trainNumber =     "_train_no_";
        const travelClassCode = "_classs_";
        const travelDate =      "_date_";

        function getClassName(code) {
            return code === "1A" ? "AC First Class (1A)"
                 : code === "EV" ? "Vistadome AC (EV)"
                 : code === "EC" ? "Exec. Chair Car (EC)"
                 : code === "2A" ? "AC 2 Tier (2A)"
                 : code === "3A" ? "AC 3 Tier (3A)"
                 : code === "3E" ? "AC 3 Economy (3E)"
                 : code === "CC" ? "AC Chair car (CC)"
                 : code === "SL" ? "Sleeper (SL)"
                 : code === "2S" ? "Second Sitting (2S)"
                 : "None";
        }

        const isVisible = el =>
            !!el &&
            window.getComputedStyle(el).display !== "none" &&
            window.getComputedStyle(el).visibility !== "hidden" &&
            window.getComputedStyle(el).opacity !== "0";

        const dateObj = new Date(travelDate);
        const formattedDate = dateObj.toDateString().split(" ")[0] + ", " + dateObj.toDateString().split(" ")[2] + " " + dateObj.toDateString().split(" ")[1];
        const className = getClassName(travelClassCode);

        const trainList = document.querySelector("#divMain > div > app-train-list");
        if (trainList) {console.log("Train list found");}
        if (!trainList) return console.error("Train list not found");
        

        const trainCards = Array.from(trainList.querySelectorAll(".tbis-div app-train-avl-enq"));
        const trainNoOnly = trainNumber.split("-")[0];
        const targetTrainCard = trainCards.find(card => card.querySelector("div.train-heading").innerText.trim().includes(trainNoOnly));
        if (targetTrainCard) {console.log("Train:",trainNumber,"found");}
        if (!targetTrainCard) return console.error("Train not found");
        

        const classLabels = Array.from(targetTrainCard.querySelectorAll("table tr td div.pre-avl"));
        const spanLabels = Array.from(targetTrainCard.querySelectorAll("span"));
        const targetClassElement = classLabels.find(el => el.querySelector("div").innerText.trim() === className) ||
                                   spanLabels.find(el => el.innerText.trim() === className);
        if (targetClassElement) {console.log("Class:",className,"found");}
        if (!targetClassElement) return console.error("Class element not found");

        const loader = document.querySelector("#loaderP");
        if (isVisible(loader)) return console.error("Loader visible, wait till it disappears");

        console.log("Clicking",className,"Class");
        //targetClassElement.click();
        simulateClick(targetClassElement);


        let bookingInProgress = false;
        const observer = new MutationObserver((mutations, observer) => {
            
            if (bookingInProgress) return; // Avoid repeated execution

            const dateTab = Array.from(targetTrainCard.querySelectorAll("div div table td div.pre-avl"))
                .find(el => el.querySelector("div").innerText.trim() === formattedDate);

            if (!dateTab) return;

            bookingInProgress = true;
            console.log("Date:",formattedDate,"  found");
            simulateClick(dateTab);
            console.log("Clicked date:", formattedDate);

            const tryClickBookButton = () => {
                const bookButton = targetTrainCard.querySelector("button.btnDefault.train_Search.ng-star-inserted");
                
                if (isVisible(loader))  {
                    console.log("Loader still visible, retrying...");
                    console.warn("Loader still visible, retrying...");
                    return setTimeout(tryClickBookButton, 100); // Retry after 100ms
                }
                if (!bookButton || bookButton.classList.contains("disable-book") || bookButton.disabled)    {
                    console.log("Book Button Not Found/Disable");
                    console.warn("Book button disabled");
                    return setTimeout(tryClickBookButton, 97); // Retry after 100ms
                }
                
                setTimeout(() => {
                console.log("going to click  on Book button");                                         
                simulateClick(bookButton);
                const now = new Date();
                console.log("Clicked on Book button",now.toLocaleTimeString());
                observer.disconnect();
                bookingInProgress = false;
                }, Math.floor(Math.random() * 30) + 90);
        
            };
            tryClickBookButton();
        });
        observer.observe(targetTrainCard, { 
            'attributes': false,
            'childList': true, 
            'subtree': true 
        });
    }

    // 🚀 Start logic immediately
    logic();
})();
