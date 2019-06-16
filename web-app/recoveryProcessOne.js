'use strict'
const network = require('./network.js');
var readline = require('readline-sync');
var processor = require('./recoveryProcessor.js')
var questionArray = ["What was the house number and street name you lived in as a child?", "What were the last four digits of your childhood telephone number?", "What primary school did you attend?", "In what town or city was your first full time job?", "What is the middle name of your oldest child?", "What are the last five digits of your driver 's licence number?", "What is your grandmother 's (on your mother's side) maiden name?", "What is your spouse or partner 's mother's maiden name ?", "In what town or city did your mother and father meet ?", "What time of the day were you born ? (hh: mm)", "What time of the day was your first child born ? (hh: mm)", "In what town or city did you meet your spouse / partner?"];
// var result = processor.checkVoting("proposal2019-06-13T21:11:04.530ZAlice0");
// result.then(function(res){
//     console.log(res);
// }
// )
// processor.basicAndVoting();
// processor.securityProblem();
async function shit()
{
    var res = await network.checkPoll("recovery", "proposal2019-06-16T20:51:59.596ZAlice0");
    console.log(res == true);
}

shit()

