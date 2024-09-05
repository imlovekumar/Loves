import {IRCTC} from "irctc-api";
const params = 
{
    "ManualCaptcha" : "tru",
    "UPI": "imloveairtel@ybl",
    "120day" :"True";
    "class": "3A",
    "quota": "GN",
    "train_number": "17216",
    "from": "ATP",
    "to": "KDP",
    "journey_date": "20240909",
    "mobile_number": "6295612485",
    "userID": "ppk00",
    "password": "Grazia@4731",
    "passengers": 
    [
        {
            "age": "20",
            "food": "",
            "name": "JYOTI KUMARI",
            "sex": "F",
            "berth":"SL"
        },
       
    ],
    "log": false
    

};
const irctc = new IRCTC();
const response = await irctc.book(params);
console.log(response);