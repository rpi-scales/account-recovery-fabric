'use strict'
var readline = require('readline-sync');
const Controller = require('./recoveryController.js')
const delay = require('delay');
var questionArray = ["","What was the house number and street name you lived in as a child?", "What were the last four digits of your childhood telephone number?", "What primary school did you attend?", "In what town or city was your first full time job?", "What is the middle name of your oldest child?", "What are the last five digits of your driver 's licence number?", "What is your grandmother 's (on your mother's side) maiden name?", "What is your spouse or partner 's mother's maiden name ?", "In what town or city did your mother and father meet ?", "What time of the day were you born ? (hh: mm)", "What time of the day was your first child born ? (hh: mm)", "In what town or city did you meet your spouse / partner?"];

async function main()
{
    
    (async () => {
        var controller = await new Controller();
        console.log(controller.queryId())
    })()
    // console.log(controller.queryId())
    // await Controller.initiateBasic();
    // var checkProposal = false;
    // var totalWait = 0;
    // while(checkProposal == false && totalWait < 100)
    // {
    //     await delay(10000);
    //     console.log("proposal not completed yet");
    //     totalWait++;
    //     checkProposal = await Controller.proposalEnded();
    // }
    // if(totalWait > 100)
    // {
    //     console.log("waiting time exceeded!");
    //     return;
    // }
    // console.log(Controller.queryId());
    // Controller.securityQuestion();
    // Controller.mnemonicWord();
    // Controller.completeRecovery();
}

main();