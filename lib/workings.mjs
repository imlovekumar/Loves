import axios from 'axios';
import {wrapper} from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { writeFileSync,readdirSync } from 'node:fs';
import {dirname,join} from "node:path";
import * as cheerio from 'cheerio';
import querystring from 'querystring';
import { execFileSync } from 'node:child_process';
import { URL,fileURLToPath } from 'node:url';
import {verify_booking_params, initialize_booking_variables, input, base64DecodeUnicode} from './utils.mjs';
import {sleep,get_current_time_api,psg_input_wait, sleep_for_login, sleep_for_availability_check} from "./time_work.mjs";
import {headers as main_headers} from './browser_headers.mjs';
import {LOG} from './logging.mjs';
import {decode,premdecode} from './captchaDecode.mjs';
import { tname } from './stations.mjs';

import chalk from 'chalk';
import logUpdate from 'log-update';
import Jimp from "jimp";


class IRCTC{
    constructor(){
        wrapper(axios);
        const cookie_jar = new CookieJar();
        this.axios_instance = axios.create({ 
            jar:cookie_jar,
            withCredentials: true,
        });
    }
    log_data(data,level="DEBUG"){
        if (this.logging){
            this.log_file.log_function(data,level);
        }
    }
    async load_irctc(){
        let response = await this.axios_instance.get(
            'https://www.irctc.co.in/nget/',
            {
                headers: main_headers.headers_1,
            }
        );
        this.first_csrf = "" + (new Date).getTime();
        const headers = main_headers.headers_2;
        headers.greq = this.first_csrf;
        response = await this.axios_instance.get(
            'https://www.irctc.co.in/eticketing/protected/profile/textToNumber/'+(new Date).getTime(),
            {
                headers: headers,
            }
        );
        this.log_data("IRCTC Loaded Successfully");
        return "IRCTC Loaded Successfully";
    }
    async sign_in(){
        this.log_data("clicking Log in button");
        await this.clicking_sign_button();
        this.log_data("Checking IRCTC Login Response data for any errors in captcha or user credentials");
        await this.getting_token();
        return "Sign In Successfull";
    }
    async clicking_sign_button(){
        let headers = main_headers.headers_3;
        headers.greq = this.first_csrf;
        process.stdout.write('fetching Captcha...');
        this.log_data("getting login captcha image");
        const response = await this.axios_instance.get(
            'https://www.irctc.co.in/eticketing/protected/mapps1/loginCaptcha?nlpCaptchaException=true',
            {
                headers: headers,
            }
        );
        this.log_data("Received Captcha Image from IRCTC");
        const captcha_response=response.data;
        this.captchaQuestion=captcha_response.captchaQuestion;
        console.log(chalk.green('fetch successfully ✓'));
        this.captcha_status=captcha_response.status;
        await this.answer_captcha();
        return "Sign Button Clicked Successfully";
           
    }
    
    async answer_captcha()
    {           
        let imagePath = 'captcha.png';
        this.log_data("Proceeding for Captcha Answering");
        writeFileSync("./"+imagePath, this.captchaQuestion, 'base64');
        if (this.mancap === 'true')
            { 
                const stdout = execFileSync(this.binaryPath, [imagePath,"-t"]);
                logUpdate(stdout+"\nPlease Type The Above Text & Press Enter:");
                this.captcha_answer =  await input('');
            }
            else
            {
                if(this.premcap === 'true')
                {
                this.captcha_answer =   await premdecode(this.captchaQuestion);
                }
                else
                {
                this.captcha_answer =   await decode(this.captchaQuestion);
                }
            }
        this.log_data("Received Captcha Answer Input");
        await this.send_login();
        return "Captcha Answered Successfully";
    }


    async send_login(){
        this.log_data("sending login data with captcha answer");
        const data = `grant_type=password&username=${this.username}&password=${this.password}&captcha=${this.captcha_answer}&uid=${this.captcha_status}&otpLogin=false&nlpIdentifier=&nlpAnswer=&nlpToken=&lso=&encodedPwd=true`;
        const headers = main_headers.headers_4;
        headers["Content-Length"] = data.length.toString();
        await sleep_for_login(this.params.ticket_time);
        logUpdate(chalk.red("Waiting..."));
        const response = await this.axios_instance.post(
            'https://www.irctc.co.in/authprovider/webtoken',
            data,
            {
                headers: headers,
            }
        );
        this.log_data("Received Login data response from IRCTC");
        this.act = response.data;
        return "Login Data Sent Successfully";
    }
    async getting_token(){
        while ("error" in this.act) {
            if (this.act["error"] === "unauthorized" && this.act["error_description"] === "Invalid Captcha....") {
                console.clear();
                Jimp.read
                (  
                    "captcha.png", (err, captcha) =>
                    {
                        if (err) throw err;
                         let ram = Math.floor(Math.random() * 1000000000).toString();
                         let path= "./WrongCaptcha/"+ram+".png";
                         captcha.write(path);
                    }
                );
            await this.clicking_sign_button();  
            } else if (this.act["error"] === "unauthorized" && this.act["error_description"] === "Bad credentials") {
                throw new Error("Invalid user and password combination");
            } else {
                throw new Error("Some Unknown error occurred in getting token process");
            }
        };
        if ("access_token" in this.act) {
            this.log_data("Received Access Token from IRCTC");
            this.access_token = "Bearer " + this.act["access_token"];
        } else {
            throw new Error("Some Unknown error occurred in getting token process");
        };
        this.log_data("Validating Access Token with IRCTC that we received previously");
        await this.validate_user();
        return "Token Generated Successfully";
    }
    async validate_user(){
        const headers = main_headers.headers_5;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.first_csrf;
        const response = await this.axios_instance.get(
            'https://www.irctc.co.in/eticketing/protected/mapps1/validateUser?source=3',
            {
                headers: headers,
            }
        );
       
        this.log_data("Received User Token Verification Data from IRCTC");
        this.user_data = response.data;
        this.user_hash = response.data["userIdHash"];
        this.csrf_token = response.headers["csrf-token"];
        console.clear();
        console.log(chalk.green('Welcome'),chalk.yellow(response.data.firstName));
        const trainname = await tname(this.train_number);
        var day = this.journey_date.substring(6,8);
        var month = this.journey_date.substring(4,6);
        var year = this.journey_date.substring(0,4);
        console.log(this.train_number,trainname,'-',this.from_stn,'-',
        this.to_stn,'-',this.class_type,'-',chalk.red(this.quota_type),
        '-',day+'.'+month+'.'+year,'\n\n');
        return "User Validated Successfully";
    }
    async get_trains(){
        const postdata = {"concessionBooking":false,"srcStn":this.from_stn,"destStn":this.to_stn,"jrnyClass":this.class_type,"jrnyDate":this.journey_date,"quotaCode":this.quota_type,"currentBooking":"false","flexiFlag":false,"handicapFlag":false,"ticketType":"E","loyaltyRedemptionBooking":false,"ftBooking":false};
        const postdata_string = JSON.stringify(postdata);
        const headers = main_headers.headers_6;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = postdata_string.length.toString();
        logUpdate('Getting Train...');
        this.log_data("Checking Running Trains List for the given From and To stations and Journey Date by sending parameters to IRCTC");
        const response = await this.axios_instance.post(
            "https://www.irctc.co.in/eticketing/protected/mapps1/altAvlEnq/TC",
            postdata_string,
            {
                headers: headers,
            }
        );
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        if ("errorMessage" in data) {
            throw new Error(data.errorMessage);
        }
        else{
            logUpdate('Getting Train Sucessful...');
            this.log_data("Received Running Trains List from IRCTC Successfully");
            return "Train List Fetched Successfully";
            

        };
    }
    async get_class_availability(){
        const postdata = {
            "paymentFlag": "N",
            "concessionBooking": false,
            "ftBooking": false,
            "loyaltyRedemptionBooking": false,
            "ticketType": "E",
            "quotaCode": this.quota_type,
            "moreThanOneDay": true,
            "trainNumber": this.train_number,
            "fromStnCode": this.from_stn,
            "toStnCode": this.to_stn,
            "isLogedinReq": true,
            "journeyDate": this.journey_date,
            "classCode": this.class_type
        };
        const postdata_string = JSON.stringify(postdata);
        const headers = main_headers.headers_7;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = postdata_string.length.toString();
        await sleep_for_availability_check(this.params.ticket_time);
        this.log_data("Fetching seats Availability for the given Train Number, From and To stations, Journey Date and Class Type by sending parameters to IRCTC");
        logUpdate(chalk.red('Getting Availability...'));
        let response = null;
        const maxRetries = 5;
        let retries = 0;
        const cust_url = `https://www.irctc.co.in/eticketing/protected/mapps1/avlFarenquiry/${this.train_number}/${this.journey_date}/${this.from_stn}/${this.to_stn}/${this.class_type}/${this.quota_type}/N`;
        while (retries < maxRetries) {
            try{
                response = await this.axios_instance.post(
                    cust_url,
                    postdata_string,
                    {
                        headers: headers,
                    }
                )
                break;
            }
            catch(error){
                if (error.response && error.response.status === 502){
                    console.log("Received Bad Gateway Response, Retrying again");
                    retries++;
                }
                else{
                    throw error;
                }
            }
        }
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        if ("errorMessage" in data) {
            throw new Error(data.errorMessage);
        }
        else {
            logUpdate(chalk.green('Received Seats Availability sucessfully...'));
            this.log_data("Received Seats Availability from IRCTC Successfully");
            await this.get_boarding_stations();
            return "Class Availability Fetched Successfully";
        }
    }
    async get_boarding_stations(){
        const postdata = {
            "clusterFlag": "N",
            "onwardFlag": "N",
            "cod": "false",
            "reservationMode": "WS_TA_B2C",
            "autoUpgradationSelected": false,
            "gnToCkOpted": false,
            "paymentType": 1,
            "twoPhaseAuthRequired": false,
            "captureAddress": 0,
            "alternateAvlInputDTO": [
                {
                    "trainNo": this.train_number,
                    "destStn": this.to_stn,
                    "srcStn": this.from_stn,
                    "jrnyDate": this.journey_date,
                    "quotaCode": this.quota_type,
                    "jrnyClass": this.class_type,
                    "concessionPassengers": false
                }
            ],
            "passBooking": false,
            "journalistBooking": false
        };
        const postdata_string = JSON.stringify(postdata);
        const headers = main_headers.headers_8;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = postdata_string.length.toString();
        this.log_data("Fetching Boarding Stations List for the given Train Number, From and To stations, Journey Date and Class Type by sending parameters to IRCTC");
        let response = null;
        const maxRetries = 5;
        let retries = 0;
        while (retries < maxRetries) {
            try{
                response = await this.axios_instance.post(
                    "https://www.irctc.co.in/eticketing/protected/mapps1/boardingStationEnq",
                    postdata_string,
                    {
                        headers: headers,
                    }
                )
                
                break;
            }
            catch(error){
                if (error.response && error.response.status === 502){
                    console.log("Received Bad Gateway Response, Retrying again");
                    retries++;
                }
                else{
                    throw error;
                }
            }
        }
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        if ("errorMessage" in data) {
            throw new Error(data.errorMessage);
        } else {
            this.log_data("Received Boarding Stations List from IRCTC Successfully");
            if (data["bkgCfgs"][0]["foodChoiceEnabled"] === true){
                if (this.foodList.includes('')){
                    throw new Error("Food choice is enabled, please provide food choice for all passengers");
                }
                else{
                    let list_B = data["bkgCfgs"][0]["foodDetails"];
                    for (const item of this.foodList) {
                        if (!list_B.includes(item)) {
                            throw new Error("Food choice is enabled, please provide food choice for all passengers");
                        };
                    };
                };
            };
            return "Boarding Stations Fetched Successfully";
        };
    }
    async fill_booking_details(){
        this.tid = (new Date).getTime().toString(36);
        const postdata = {
            "clusterFlag": "N",
            "onwardFlag": "N",
            "cod": "false",
            "reservationMode": "WS_TA_B2C",
            "autoUpgradationSelected": true,
            "gnToCkOpted": false,
            "paymentType": "2",
            "twoPhaseAuthRequired": false,
            "captureAddress": 0,
            "wsUserLogin": this.username,
            "moreThanOneDay": false,
            "clientTransactionId": this.tid,
            "boardingStation": this.from_stn,
            "reservationUptoStation": this.to_stn,
            "mobileNumber": this.mobile_number,
            "ticketType": "E",
            "mainJourneyTxnId": null,
            "mainJourneyPnr": "",
            "captcha": "",
            "generalistChildConfirm": false,
            "ftBooking": false,
            "loyaltyRedemptionBooking": false,
            "nosbBooking": false,
            "warrentType": 0,
            "ftTnCAgree": false,
            "bookingChoice": 1,
            "bookingConfirmChoice": 1,
            "bookOnlyIfCnf": true,
            "returnJourney": null,
            "connectingJourney": false,
            "lapAvlRequestDTO": [{
                "trainNo": this.train_number,
                "journeyDate": this.journey_date,
                "fromStation": this.from_stn,
                "toStation": this.to_stn,
                "journeyClass": this.class_type,
                "quota": this.quota_type,
                "coachId": null,
                "reservationChoice": 4,
                "ignoreChoiceIfWl": false,
                "travelInsuranceOpted": "true",
                "warrentType": 0,
                "coachPreferred": false,
                "autoUpgradation": false,
                "bookOnlyIfCnf": true,
                "addMealInput": null,
                "concessionBooking": false,
                "passengerList": this.passengers,
                "ssQuotaSplitCoach": "N"
            }],
            "gstDetails": {
              "gstIn": "",
              "error": null
            }
        };
        if (this.params.coach){
            postdata.lapAvlRequestDTO[0].coachId = this.params.coach;
        }
        const postdata_string = JSON.stringify(postdata);
        const headers = main_headers.headers_9;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = postdata_string.length.toString();
        const date_time_string = await get_current_time_api();
        const currentTime = new Date(date_time_string);
        const targetTime = new Date(currentTime);
        targetTime.setUTCHours(6, 30, 0, 0);
        if (currentTime > targetTime) 
        {
            for (let i=2000* 0.001 ; i>=1;i=i-1)
                { 
                    logUpdate(chalk.greenBright(`Passenger Detail Submitting In`,chalk.red(`${i}`), `seconds ....`));
                    await sleep(1000);
                };
        }
        else
        {
        await psg_input_wait(this.psg_count);
        }
        logUpdate('Sending Booking Details to IRCTC...');
        this.log_data("Sending Main Booking Details to IRCTC");
        const response = await this.axios_instance.post(
            "https://www.irctc.co.in/eticketing/protected/mapps1/allLapAvlFareEnq/Y",
            postdata_string,
            {
                headers: headers,
            }
        )
       
        this.csrf_token = response.headers["csrf-token"];
       // console.log(new Date().toLocaleTimeString('en-US', {timeZone: "Asia/Kolkata"}));
        const data = response.data;
        if ("errorMessage" in data) 
        {
            throw new Error(data.errorMessage);
        } 
        else 
        if ("confirmation" in data) 
        {
            /*if (data.avlFareResponseDTO[0].avlDayList[0].availablityStatus === "NOT AVAILABLE")
             {   
                throw new Error("Tickets are unavailable, Exiting Booking Process");
             }
            else
            {
            logUpdate('Do You Want To Continue',data.avlFareResponseDTO[0].avlDayList[0].availablityStatus,'(Y/N):');
            var answer = await input('');
            if (answer === "Y" || answer === "y") 
            {
                this.captchaQuestion = data["captchaDto"]["captchaQuestion"]
                return "Booking Details Filled Successfully";
            } 
            else 
            {
                throw new Error("Tickets are unavailable, Exiting Booking Process");
            }
            }*/
            throw new Error("Tickets are unavailable, Exiting Booking Process");

        } 
        else 
        {
            this.log_data("Received Main Booking Details from IRCTC Successfully");
            this.amnt = data["totalCollectibleAmount"];
            if (data["captchaDto"]["nlpcaptchEnabled"] == true)
            {
                throw new Error("NLP Captcha is enabled, it is not supported yet")
            }
            else
            {
                logUpdate("Waiting For Final Captcha...");
                this.captchaQuestion = data["captchaDto"]["captchaQuestion"]
                //logUpdate('Aailablity Status : ', data.avlFareResponseDTO[0].avlDayList[0].availablityStatus,'\n')
                return "Booking Details Filled Successfully";
            };
        };
    }
    
    async confirm_booking(){
        this.booking_captcha_response = "FAIL";
        const headers = main_headers.headers_10;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        while (this.booking_captcha_response !== "SUCCESS")
        {
            await this.answer_captcha();
            headers['spa-csrf-token'] = this.csrf_token;
            this.log_data("Sending an http request to IRCTC for self confirmation of already sent booking data using captcha");
            let response = await this.axios_instance.get(
                `https://www.irctc.co.in/eticketing/protected/mapps1/captchaverify/${this.tid}/BOOKINGWS/${this.captcha_answer}`,
                {
                    headers: headers,
                }
            );
            this.csrf_token = response.headers["csrf-token"];
            let data = response.data;
            this.booking_captcha_response = data.status;
            if (this.booking_captcha_response === "FAIL"){
                logUpdate('Wrong Captcha !');
                this.captchaQuestion = response.data["captchaQuestion"];
            };
        };
        logUpdate(chalk.green('Captcha Successfully...'));
        return "Booking Details were self confirmed using captcha Successfully";
    }
    async select_paytm_upi_gateway(){
        const data = {"bankId":"117","txnType":1,"paramList":[],"amount":this.amnt,"transationId":0,"txnStatus":1};
        const data_string = JSON.stringify(data);
        const headers = main_headers.headers_11;
        headers.greq = this.captcha_status;
        headers.Authorization = this.access_token;
        headers['spa-csrf-token'] = this.csrf_token;
        headers.bmiyek = this.user_hash;
        headers["Content-Length"] = data_string.length.toString();
        this.log_data("Selecting Paytm UPI Gateway for Payment");
        const response = await this.axios_instance.post(
            `https://www.irctc.co.in/eticketing/protected/mapps1/bookingInitPayment/${this.tid}?insurenceApplicable=`,
            data_string,
            {
                headers: headers,
            }
        );
        this.csrf_token = response.headers["csrf-token"];
        if (response.data.hasOwnProperty("errorMsg")){
            throw new Error(response.data.errorMsg);
        }
        if (!response.data.hasOwnProperty("paramList")){
            throw new Error("Payment Paramets is not available in IRCTC Response, Exiting Booking Process");
        } else {
            this.log_data("Received Paytm UPI Gateway Parameters Data from IRCTC Successfully");
            const paramlist = response.data["paramList"];
            let oid = "";
            for (let f of paramlist) {
                if (f["key"] === "TXN") {
                    oid = f["value"];
                    break;
                };
            };
            this.oid = oid;
            await this.get_gateway_redirect_params();
            return "Paytm UPI Payment Gateway Selected Successfully";
        };
    }
    async get_gateway_redirect_params(){
        const xx = `${(new Date).getTime() / (1e5 * Math.random())}${this.csrf_token}${(new Date).getTime() / (1e6 * Math.random())}`;
        const raw_token = this.access_token.split("Bearer ")[1];
        const b = `token=${raw_token}&txn=${this.username}%3A${this.tid}&${this.username}%3A${this.tid}=${xx}`;
        const headers = main_headers.headers_12;
        headers["Content-Length"] = b.length.toString();
        this.log_data("Fetching Paytm UPI Gateway Redirect Parameters");
        const response = await this.axios_instance.post(
            "https://www.wps.irctc.co.in/eticketing/PaymentRedirect",
            b,
            {
                headers: headers,
            }
        );
        this.paytm_html = response.data;
        this.log_data("Received Paytm UPI Gateway Redirect Parameters from IRCTC Successfully");
        await this.going_to_paytm();
        return "Paytm UPI Gateway Redirect Parameters Fetched Successfully";
    }
    async going_to_paytm(){
        const $ = cheerio.load(this.paytm_html);
        const form = $('form');
        const action_url = form.attr('action')
        const input_elements = form.find('input');
        let body_data = {};
        input_elements.each((index, element) => {
            const raw_variable = $(element).attr('value');
            body_data[$(element).attr('name')] = raw_variable;
        });
        const headers = main_headers.headers_13;
        const url = new URL(action_url);
        headers["Host"] = url.origin.split('//')[1];
        this.log_data("Going to Paytm UPI Gateway for Payment");
        const response = await this.axios_instance.post(
            action_url,
            body_data,
            {
                headers: headers,
                withCredentials: false
            }
        );
        this.paytm_params_d = response.data;
        this.log_data("Reached Paytm UPI Gateway for Payment");
        await this.paytm_pg_landing_page();
        return "Gone to Paytm UPI Gateway Successfully";
    }
    async paytm_pg_landing_page(){
        let script_data = this.paytm_params_d;
        const pushAppData = script_data.split('pushAppData="')[1].split('",encodeFlag=')[0];
        const encodeFlag = script_data.split(',encodeFlag="')[1].split('";')[0];
        let D = "true" == encodeFlag ? JSON.parse(base64DecodeUnicode(pushAppData)) : JSON.parse(pushAppData);
        this.txntkn = D["txnToken"],
        this.MID = D["merchant"]["mid"];
        await this.send_upi_collect_request();
        return "Paytm PG Landing Page Loaded Successfully";
    }
    async send_upi_collect_request(){
        const {oid,txntkn,MID,upiid} = this;
        const tmp = new Date().getTime();
        const data = {
            'head': {
                'version': 'v1',
                'requestTimestamp': tmp,
                'channelId': 'WEB',
                'txnToken': txntkn,
                'workFlow': 'enhancedCashierFlow',
                'token': txntkn,
                'tokenType': 'TXN_TOKEN'
            },
            'body': {
                'paymentMode': 'UPI',
                'payerAccount': upiid,
                'requestType': 'NATIVE',
                'authMode': '3D',
                'mid': MID,
                'orderId': oid,
                'paymentFlow': 'NONE',
                'selectedPaymentModeId': "2",
                'riskExtendInfo': "userAgent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0|timeZone:Asia/Calcutta|operationType:PAYMENT|refererURL:https://securegw.paytm.in/|businessFlow:STANDARD|amount:32.25|merchantType:offus|language:en-US|screenResolution:1536X864|networkType:4g|osType:Windows|osVersion:10|platform:WEB|channelId:WEB|deviceType:Desktop|browserType:Edge|browserVersion:123.0.0.0|"
            },
            'showPostFetchLoader': false
        };
        const data_string = JSON.stringify(data);
        const action_url = `https://secure.paytmpayments.com/theia/api/v1/processTransaction?mid=${MID}&orderId=${oid}`;
        const headers = main_headers.headers_14;
        headers['Content-Length'] = data_string.length.toString();
        const url = new URL(action_url);
        headers["Host"] = url.origin.split('//')[1];
        this.log_data("Sending UPI Collect Request to Paytm by giving UPI ID for Payment");
        const response = await this.axios_instance.post(
            action_url,
            data_string,
            {
                headers: headers,
            }
        );
        const y = response.data;
        if (y["body"]["resultInfo"]["resultStatus"] == "F"){
            throw new Error(y["body"]["resultInfo"]["resultMsg"])
        }
        else{
            const ct= new Date().toLocaleTimeString('en-US', {timeZone: "Asia/Kolkata"})
            const my_string = `Please Approve Payment in your ${y["body"]["content"]["upiHandleInfo"]["upiAppName"]} App...\n\n UPI ID: ${y["body"]["content"]["MERCHANT_VPA"]} \n Amount: ${y["body"]["content"]["TXN_AMOUNT"]} \n Remarks: \'Oid${y["body"]["content"]["ORDER_ID"]}@IRCTCWebUPI\' `;
            this.log_data(my_string, "INFO");
            logUpdate('Current Time:',ct,'\n\n',my_string);
        }
        this.paycon = y["body"]["content"];
        await this.get_upi_transaction_status();
        // await this.get_completed_payment_params();
        return "UPI Collect Request Sent Successfully";
    }
    async get_upi_transaction_status(){
        const data ={
            merchantId: this.MID,
            orderId: this.oid,
            transId: this.paycon.transId,
            paymentMode: 'UPI',
            cashierRequestId: this.paycon.cashierRequestId
        };
        const data_string = querystring.stringify(data);
        const headers = main_headers.headers_15;
        const action_url = this.paycon.upiStatusUrl;
        const url = new URL(action_url);
        headers["Host"] = url.origin.split('//')[1];
        headers["Content-Length"] = data_string.length.toString();
        while (true){
            this.log_data("Fetching whether any update from UPI App for the Payment Transaction Status");
            let response = await this.axios_instance.post(
                action_url,
                data_string,
                {
                    headers: headers,
                }
            );
            let Z = response.data;
            let poll_stat = Z["POLL_STATUS"];
            if (poll_stat !== "POLL_AGAIN"){
                this.log_data("Received an update about the UPI Collect Transaction");
                break;
            }
        }
        await this.get_completed_payment_params();
        return "UPI Transaction Status Fetched Successfully";
    }
    async get_completed_payment_params(){
        // await input("Type Anything below and press enter after completing the payment in your UPI App");
        const{oid,MID} = this;
        const data_string = querystring.stringify(this.paycon);
        const headers = main_headers.headers_16;
        headers.Referer = `https://secure.paytmpayments.com/theia/transactionStatus?MID=${MID}&ORDER_ID=${oid}`;
        headers["Content-Length"] = data_string.length.toString();
        const action_url = `https://secure.paytmpayments.com/theia/transactionStatus??MID=${MID}&ORDER_ID=${oid}`;
        const url = new URL(action_url);
        headers["Host"] = url.origin.split('//')[1];
        headers["Content-Length"] = data_string.length.toString();
        this.log_data("Fetching Completed Payment Parameters from Paytm UPI Gateway");
        const response = await this.axios_instance.post(
            action_url,
            data_string,
            {
                headers: headers
            }
        );
        const xx = response.data;
        if (xx.includes('pushAppData="')){
            this.paytm_params_d = xx;
            console.log("Trying payment again due to unsuccessful transaction")
            await this.paytm_pg_landing_page();
        }
        else{
            this.callback_data = xx;
            this.log_data("Received Final Completed Payment Parameters from Paytm UPI Gateway");
            await this.callback_to_irctc();
            return "IRCTC CallBack Payment Details Fetched Successfully";
        }
    }
    async callback_to_irctc(){
        var $ = cheerio.load(this.callback_data),
        form = $('form[name="TESTFORM"]'),
        action_url = form.attr('action'),
        input_elements = form.find('input'),
        body_data = {};
        input_elements.each((index, element) => {
            const raw_variable = $(element).attr('value');
            body_data[$(element).attr('name')] = raw_variable;
        });
        const data = querystring.stringify(body_data);
        const headers = main_headers.headers_17;
        const url = new URL(action_url);
        headers["Host"] = url.origin.split('//')[1];
        headers["Content-Length"] = data.length.toString();
        try{
            this.log_data("Sending Payment Response Callback Data to IRCTC");
            const response = await this.axios_instance.post(
                action_url,
                data,
                {
                    headers: headers,
                    maxRedirects: 0
                }
            );
            return "IRCTC CallBack Payment Successful";
        }
        catch(e){
            this.log_data("Received a redirect Response from IRCTC. Going to that redirect url");
            const response = await this.axios_instance.get(
                e.response.headers.location,
                {
                    headers: main_headers.headers_18,
                }
            );
            return "IRCTC CallBack Payment Successful";
        }
    }
    async get_booking_details(){
        const action_url = `https://www.wps.irctc.co.in/eticketing/protected/mapps1/bookingData/${this.tid}`;
        const headers = main_headers.headers_19;
        headers.bmiyek = this.user_hash;
        headers.greq = this.captcha_status;
        headers["spa-csrf-token"] = "" + (new Date).getTime();
        headers.Authorization = this.access_token;
        this.log_data("Fetching Booking Details from IRCTC");
        const response = await this.axios_instance.get(
            action_url,
            {
                headers: headers,
            }
        );
        const data = response.data;
        return data;
    }
    async book(params){
        this.log_file = new LOG(params.log);
        if (params.viu && typeof params.viu === "string"){
            this.binaryPath = params.viu;
        }
        else{
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const path_l = join(__dirname, "..","bin");
            const files = readdirSync(path_l);
            let path_n = "";
            if (files.length === 0) {
                throw new Error("Platform not supported, Request you to manually download the viu binary file from rust standard installation page and then after installing\nOption 1: Place the binary file inside this bin folder located in. "+path_l+"\nOption 2: Give viu binary path location in the params as 'viu':'path/to/viu | path/to/viu.exe'")
            }
            else{
                path_n = files[0];
            }
            this.binaryPath = join(path_l, path_n);
        }
        this.logging = params.log;
        this.params = params;
        await verify_booking_params(this.params);
        initialize_booking_variables(this);
        await this.load_irctc();
        await this.sign_in();
        await this.get_trains();
        await this.get_class_availability();
        await this.fill_booking_details();
        await this.confirm_booking();
        await this.select_paytm_upi_gateway();
        const response = await this.get_booking_details();
        return response;
    }
    async last_transaction_depth(){
        const action_url = `https://www.irctc.co.in/eticketing/protected/mapps1/historySearchByTxnId/${this.profile_last_tid}?currentStatus=L`;
        const headers = main_headers.headers_22;
        headers.Authorization = this.access_token;
        headers.greq = this.captcha_status;
        headers.bmiyek = this.user_hash;
        headers["spa-csrf-token"] = this.csrf_token;
        headers["Referer"] = `https://www.irctc.co.in/nget/enquiry/last-book-ticket?txnId=${this.profile_last_tid}`;
        const response = await this.axios_instance.get(
            action_url,
            {
                headers: headers,
            }
        );
        this.csrf_token = response.headers["csrf-token"];
        return response.data;
    }
    async last_transaction(params){
        this.params = {};
        this.params.ticket_time = 0;
        this.username = params.userID;
        this.password = btoa(params.password);
        await this.load_irctc();
        await this.sign_in();
        const headers = main_headers.headers_20;
        headers.Authorization = this.access_token;
        headers.greq = this.captcha_status;
        headers.bmiyek = this.user_hash;
        const action_url = "https://www.irctc.co.in/eticketing/protected/mapps1/recentTxnsDetails";
        const response = await this.axios_instance.get(
            action_url,
            {
                headers: headers,
            }
        );
        this.profile_last_tid = response.data.lastTxnList[0].transactionId;
        const new_data = await this.last_transaction_depth();
        return new_data;
    }
    async pnr_status(params){
        this.pnr = params.pnr;
        this.params = {};
        this.params.ticket_time = 0;
        this.username = params.userID;
        this.password = btoa(params.password);
        await this.load_irctc();
        await this.sign_in();
        const headers = main_headers.headers_21;
        headers.Authorization = this.access_token;
        headers.greq = this.captcha_status;
        headers.bmiyek = this.user_hash;
        headers["spa-csrf-token"] = this.csrf_token;
        const action_url = `https://www.irctc.co.in/eticketing/protected/mapps1/pnrenq/${this.pnr}?pnrEnqType=E`;
        const response = await this.axios_instance.get(
            action_url,
            {
                headers: headers,
            }
        );
        this.csrf_token = response.headers["csrf-token"];
        const data = response.data;
        return data;
    }
};
export {IRCTC as main_class};