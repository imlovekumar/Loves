(function() {
  // define helper functions here if needed

  function train_list() {
    // your captcah Script here
        __train_list__
  }

  function psgninput() {
    // your captcah Script here
        __psgninput__
  }

  function final_captcha() {
    // your captcah Script here
        __final_captcha__
  }

  function select_pay() {
    // your select pay script here
        __select_pay__
  }

  function on_paytm() {
    // your payment option selection here
        __on_paytm__
  }

  // Flags to prevent re-execution
  window.hasRuntrain_list = window.hasRuntrain_list || false;
  window.hasRunpsgninput = window.hasRunpsgninput || false;
  window.hasRunFinalCaptcha = window.hasRunFinalCaptcha || false;  
  window.hasRunSelectPay = window.hasRunSelectPay || false;
  window.hasRunOnPaytm = window.hasRunOnPaytm || false;
  

  function checkPage() {
    const url = window.location.href;

    if (url.includes('train-list') && !window.hasRuntrain_list ) {
      window.hasRuntrain_list = true;
      train_list();
    } 
    else if (url.includes('psgninput') && !window.hasRunpsgninput ) {
      window.hasRunpsgninput = true;
      psgninput();
    } 
    else if (url.includes('reviewBooking') && !window.hasRunFinalCaptcha ) {
      window.hasRunFinalCaptcha = true;
      final_captcha();
    } 
    else if (url.includes('bkgPaymentOptions') && !window.hasRunSelectPay ) {
      window.hasRunSelectPay = true;
      select_pay();
    } 
    else if (url.includes('paytmpayments') && !window.hasRunOnPaytm ) {
      window.hasRunOnPaytm = true;
      on_paytm();
    }
  }
  // Watch every second
  if (!window.myCheckInterval) {
      window.myCheckInterval = setInterval(checkPage, 1000);
  }

  // Also re-check on every page load
  window.addEventListener('load', function() {
      console.log("Page reloaded — re-checking page");
      checkPage();
  });

})();
