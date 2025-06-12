(function() {
    function addDelay(ms) 
    {
        return new Promise(res => setTimeout(res, ms));
    }
    function simulateClick(element) {
        if (element && typeof element.dispatchEvent === "function") {
            if (typeof element.focus === "function") 
            {
                try {  element.focus();    }
                catch (err) { console.warn("Could not focus element before click:", element, err.message);    }
            }
            if (element.disabled) {   console.warn("Attempted to click on a disabled element:", element); return; }
            const mouseDown = new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window, button: 0 });
            const mouseUp = new MouseEvent("mouseup", { bubbles: true, cancelable: true, view: window, button: 0 });
            const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true, view: window, button: 0 });
            element.dispatchEvent(mouseDown);
            element.dispatchEvent(mouseUp);
            element.dispatchEvent(clickEvent);
        } else { console.warn("Invalid element for simulateClick:", element);    }
    }

    let paymentGroup = "BHIM/ UPI/ USSD";
    let paymentOption = "Pay using BHIM (Powered by PAYTM ) also accepts UPI";
    let found = false;
    console.log("Searching",paymentOption);
    let interval = setInterval(() => {
        if (document.getElementsByClassName("bank-type").length > 1) {
            clearInterval(interval);
            let groups = document.getElementById("pay-type").getElementsByTagName("div");
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].innerText.includes(paymentGroup)) {
                    console.log(paymentGroup,"Found !");
                    simulateClick(groups[i]);
                    console.log(paymentGroup,"Selected !");
                    setTimeout(() => {
                        let methods = document.getElementsByClassName("border-all no-pad");
                        for (let j = 0; j < methods.length; j++) {
                            let label = methods[j].getElementsByTagName("span")[0]?.innerText || "";
                            if (methods[j].getBoundingClientRect().top !== 0 && label.toUpperCase().includes(paymentOption.toUpperCase())) {
                                console.log(paymentOption,"Found !");
                                simulateClick(methods[j]);
                                console.log(paymentOption,"Selected !");
                                found = true;
                                document.getElementsByClassName("btn-primary")[0].scrollIntoView({
                                    behavior: "smooth",
                                    block: "center"
                                });
                                setTimeout(() => {
                                    console.log("Auto Pay & Book Clicked !");
                                    simulateClick(document.getElementsByClassName("btn-primary")[0]);
                                }, 500);
                                break;
                            }
                        }
                        if (!found) {
                            console.log(paymentOption,"Not Available. Please Choose Manually.");
                        }
                    }, 500);
                    break;
                }
            }
        }
    }, 500);
})();