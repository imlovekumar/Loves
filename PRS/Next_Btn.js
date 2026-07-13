async function checkAvailabilityAndClickNext() {

    function clickNext() {
        const btn = document.querySelector('button[type="submit"].mat-raised-button.mat-accent');

        if (btn) {
            btn.click();
            return;
        }
        const next = [...document.querySelectorAll("span.mat-button-wrapper")]
            .find(el => el.textContent.trim() === "Next");

        next?.closest("button")?.click();
    }

    function processStatus() {
        const status = [...document.querySelectorAll("span")]
            .find(el => el.textContent.includes("AVAILABILITY STATUS"));

        if (!status) return null; // Not loaded yet

        const text = status.textContent.toUpperCase();
        if (/\bAVAILABLE\b/i.test(text)) {
            clickNext();
            return true;
        }

        console.log("Not Available");
        return false;
    }

    const result = processStatus();
    if (result !== null) 
        return result;

    return new Promise(resolve => {

        const observer = new MutationObserver(() => {
            const result = processStatus();
            if (result !== null) {
                observer.disconnect();
                resolve(result);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

    });
}




javascript:(function(){

    function clickNext() {
        const btn = document.querySelector('button[type="submit"].mat-raised-button.mat-accent');
        if (btn) {
            btn.click();
            return;
        }

        const next = [...document.querySelectorAll('span.mat-button-wrapper')]
            .find(el => el.textContent.trim() === "Next");

        next?.closest("button")?.click();
    }

    function checkStatus() {
        const status = [...document.querySelectorAll("span")]
            .find(el => el.textContent.includes("AVAILABILITY STATUS"));

        if (!status) return false;

        const text = status.textContent.trim().toUpperCase();

        if (/AVAILABLE/i.test(text)) {
            clickNext();
        } else {
            console.log("not Available");
        }

        return true;
    }

    if (checkStatus()) return;

    const observer = new MutationObserver(() => {
        if (checkStatus()) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

})();