'use strict'
const network = require('./network.js');
var readline = require('readline-sync');
async function main() {
    var id = readline.question("What is your id? ");
    console.log("Choose three security question from below: ")
    var questionArray = ["What was the house number and street name you lived in as a child?", "What were the last four digits of your childhood telephone number?", "What primary school did you attend?", "In what town or city was your first full time job?", "What is the middle name of your oldest child?", "What are the last five digits of your driver 's licence number?", "What is your grandmother 's (on your mother's side) maiden name?", "What is your spouse or partner 's mother's maiden name ?", "In what town or city did your mother and father meet ?", "What time of the day were you born ? (hh: mm)", "What time of the day was your first child born ? (hh: mm)", "In what town or city did you meet your spouse / partner?"];
    var indexArray = [];
    var total = 0;
    while(total != 3)
    {
        for(let i=0; i<questionArray.length; i++)
        {
            console.log((i+1).toString() + ".",questionArray[i]);
        }
        var index = readline.question("Choose one security question from above: ");
        if(indexArray.includes(index))
        {
            console.log("You cannot choose the same question twice.");
            continue;
        }
        indexArray.push(index);
        var answer = readline.question("Give answer to your selected question: ")
        try{
            await network.addSecurityQuestion("recovery", id, index, answer);
        }
        catch(error){
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);
        }
        total++;
    } 
}   

main()