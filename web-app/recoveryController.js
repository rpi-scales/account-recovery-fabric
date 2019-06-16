'use strict'
const network = require('./network.js');
var readline = require('readline-sync');
var processor = require('./recoveryProcessor.js')
var questionArray = ["", "What was the house number and street name you lived in as a child?", "What were the last four digits of your childhood telephone number?", "What primary school did you attend?", "In what town or city was your first full time job?", "What is the middle name of your oldest child?", "What are the last five digits of your driver 's licence number?", "What is your grandmother 's (on your mother's side) maiden name?", "What is your spouse or partner 's mother's maiden name ?", "In what town or city did your mother and father meet ?", "What time of the day were you born ? (hh: mm)", "What time of the day was your first child born ? (hh: mm)", "In what town or city did you meet your spouse / partner?"];

class recoveryController {
    constructor() {
        this.initiateBasic();
    }

    initiateBasic() {
        (async () => {
            this.voting = false;
            this.proposal = "";
            this.points = 0;
            this.basic = false;
            this.security = false;
            this.mnemonic = false;
            this.intiator = "";
            this.detail = "";
            var res = "";
            res = await processor.basicAndVoting();
            if (res == {}) {
                this.id = "";
                return;
            }
            if (res["proposal"] != "") {
                this.voting = true;
                this.basic = true;
                this.proposal = res["proposal"];
                this.id = res["id"];
                this.intiator = res["initiator"];
                this.detail = res["detail"];
            } else {
                this.points += 50;
            }
        })()
    }

    queryId() {
        (async () => {
            return this.id;
        })()

    }

    static async proposalEnded() {
        if (this.id = false) {
            console.log("you have to fill in the correct basic information");
            return false;
        }
        if (this.voting == false) {
            console.log("proposal not needed!");
            return true;
        }
        var res = await processor.checkVoting(this.proposal);
        if (res == "true") {
            this.points += 50;
            this.voting = false;
            return true;
        } else if (res == "false") {
            return true;
        } else {
            return false;
        }
    }

    static async securityQuestion() {
        if (this.id == false) {
            console.log("you have to fill in the correct basic information");
            return;
        }
        if (this.security) {
            console.log("security question already completed");
        }
        if (this.voting == true && !this.proposalEnded()) {
            console.log("proposal not ended");
            return;
        }
        var res = processor.securityProblem(this.id);
        this.points += res["correct"] * 10;
        this.security = true;
        return;
    }

    static async mnemonicWord() {
        if (this.id == false) {
            console.log("you have to fill in the correct basic information");
            return;
        }
        if (!this.security) {
            console.log("security question not filled yet");
            return;
        }
        if (this.mnemonic) {
            console.log("mnemonic words already completed");
            return;
        }
        var res = processor.queryMnemonic(this.id);
        this.points += res["correct"] * 10;
        return;
    }

    static async completeRecovery() {
        if (!this.mnemonic) {
            console.log("mnmemonic words not completed")
            return;
        }
        if (this.points > 60) {
            console.log("Account recovered successfully");
            var res = network.transferAccount(this.id, this.initiator, this.detail);
            this.initiateBasic();
        } else {
            console.log("Account recovery failed");
            this.initiateBasic();
        }
    }
}

module.exports = recoveryController;