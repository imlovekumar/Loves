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
  let hasRuntrain_list = false;
  let hasRunpsgninput = false;
  let hasRunFinalCaptcha = false;
  let hasRunSelectPay = false;
  let hasRunOnPaytm = false;
  

  function checkPage() {
    const url = window.location.href;

    if (url.includes('train-list') && !hasRuntrain_list ) {
      hasRuntrain_list = true;
      train_list();
    } 
    else if (url.includes('psgninput') && !hasRunpsgninput ) {
      hasRunpsgninput = true;
      psgninput();
    } 
    else if (url.includes('reviewBooking') && !hasRunFinalCaptcha ) {
      hasRunFinalCaptcha = true;
      final_captcha();
    } 
    else if (url.includes('bkgPaymentOptions') && !hasRunSelectPay ) {
      hasRunSelectPay = true;
      select_pay();
    } 
    else if (url.includes('paytmpayments') && !hasRunOnPaytm ) {
      hasRunOnPaytm = true;
      on_paytm();
    }
  }

  checkPage();
  setInterval(checkPage, 1000); // re-check every second

})();
