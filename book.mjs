import {IRCTC} from "irctc-api";
const params = 
{
    "ManualCaptcha" : "N",      // For Manual Entry  (Y/N)
    "PremiumCaptcha": "N",      //For 100 Sucess Rate  (Y/N)
    "firstday" : "N",             //only In case 120 Days Before (Y/N)
    "UPI": "imloveairtel@ybl",
    "class": "3A",
    "quota": "GN",
    "train_number": "12163",
    "from": "TU",
    "to": "RU",
    "journey_date": "20240909",
    "mobile_number": "7987094362",
    "userID": "PPK01",
    "password": "9024",
    "passengers": 
    [
        {
            "age": "31",
            "food": "",
            "name": "Manoj K Meena",
            "sex": "M",
            "berth":"SL"
        },
       
    ],
    "log": false
    

};
const irctc = new IRCTC();
const response = await irctc.book(params);
console.log(response);
