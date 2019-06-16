'use strict'
const network = require('./network.js');
var readline = require('readline-sync');
var questionArray = ["","What was the house number and street name you lived in as a child?", "What were the last four digits of your childhood telephone number?", "What primary school did you attend?", "In what town or city was your first full time job?", "What is the middle name of your oldest child?", "What are the last five digits of your driver 's licence number?", "What is your grandmother 's (on your mother's side) maiden name?", "What is your spouse or partner 's mother's maiden name ?", "In what town or city did your mother and father meet ?", "What time of the day were you born ? (hh: mm)", "What time of the day was your first child born ? (hh: mm)", "In what town or city did you meet your spouse / partner?"];
class recoveryProcessor
{
    // constructor()
    // {   
    //     this.voting = false;
    //     this.oneReady = false;
    //     this.id = '';
    // }

    static async basicAndVoting() 
    {
        var id = readline.question("What is your old account id? ");
        var privateKey;
        var step = 0;
        while (true) {
            privateKey = readline.question("Do you remember your private key?(y/n)");
            if (privateKey != "y" && privateKey != "n") {
                console.log("invalid format of answer!");
                continue;
            } else {
                if (privateKey == "y") {
                    step = 1;
                } else {
                    step = 2;
                }
                break;
            }
        }
        if (step == 2) {
            console.log("Started a proposal to recover your account based on voting");
            var dateString = new Date().toISOString();
            var proposalName = "proposal" + dateString + id;
            console.log("proposal name: " + proposalName);
            var sos = readline.question("Input your state of situation: ");
            var detail = readline.question("Input details about yourself: ");
            var initiator = readline.question("Input your current account id: ");
            var res = await network.queryAccount("recovery", initiator);
            console.log(res);
            if (res.localeCompare("\"Not exist\"", "en-US") == 0) {
                throw new Error("Initiator not exist!");
            }
            else
            {
                console.log("initiator exists!")
            }
            await network.startPoll("recovery", proposalName, sos, detail, initiator, id);
            console.log("Poll started");
            return {"id": id, "proposal": proposalName, "initiator": initiator, "detail": detail }
        } 
        else
        {
            return {"id": id, "proposal": "", "initiator": "", "detail": ""}
        } 
    } 
    static async checkVoting(proposalName)
    {
        var result = await network.checkPoll("recovery", proposalName);
        console.log(result);
        return result;
    }
    static async securityProblem(traderKey)
    {
        var result = await network.SecurityProblem("recovery", traderKey);
        result = JSON.parse(result);
        var length = result.length;
        console.log('Please answer your preset '+length+' security problems: ')
        var correct = 0;
        for(let i=0; i<result.length; i++)
        {
            var questionString = questionArray[result[i][0]];
            var answer = readline.question(questionString + ": ");
            if(answer != result[i][1])
            {
                console.log("Wrong!");
                var response = readline.question("Answer again or quit?(y/n)");
                if(response = "y")
                {
                    i--;
                }
            }
            else
            {
                correct++;
            }
        }
        return {"correct": correct, "total": result.length};
    }

    static async queryMnemonic(traderKey)
    {
        var result = await network.queryMnemonic("recovery", traderKey);
        result = JSON.parse(result);
        var answer = [];
        var correct = 0;
        while(true)
        {
            var current = readline.question("Input a Mnemonic word or escape if you want to quit: ");
            if(current == "")
            {
                break;
            }
            if(answer.includes(current))
            {
                console.log(current + " already exists!");
                continue;
            }
            if(result["wordList"].includes(current))
            {
                correct++;
            }
            answer.push(current);
        }
        console.log(answer);
        console.log(correct);
        return {"correct": correct, "total": result.length};
    }
}

module.exports = recoveryProcessor;
