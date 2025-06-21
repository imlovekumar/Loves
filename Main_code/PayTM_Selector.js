(function() {
    function addDelay(ms) 
    {
        return new Promise(res => setTimeout(res, ms));
    }
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

    let paymentGroup = "BHIM/ UPI/ USSD";
    let paymentOption = "Pay using BHIM (Powered by PAYTM ) also accepts UPI";
    let found = false;
    //console.log("Searching",paymentOption);
    let interval = setInterval(() => {
        if (document.getElementsByClassName("bank-type").length > 1) {
            clearInterval(interval);
            let groups = document.getElementById("pay-type").getElementsByTagName("div");
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].innerText.includes(paymentGroup)) {
                    //console.log(paymentGroup,"Found !");
                    simulateClick(groups[i]);
                    console.log(paymentGroup,"Selected !");
                    setTimeout(() => {
                        let methods = document.getElementsByClassName("border-all no-pad");
                        for (let j = 0; j < methods.length; j++) {
                            let label = methods[j].getElementsByTagName("span")[0]?.innerText || "";
                            if (methods[j].getBoundingClientRect().top !== 0 && label.toUpperCase().includes(paymentOption.toUpperCase())) {
                                //console.log(paymentOption,"Found !");
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
                                }, 1000);
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
