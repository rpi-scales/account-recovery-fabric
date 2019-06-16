'use strict';
const { Contract } = require('fabric-contract-api');
var CircularJSON = require('circular-json');
var fs = require("fs");
var readline = require('readline-sync');

let STATE_KEYS = Naivebayes.prototype.STATE_KEYS = [
    'categories', 'docCount', 'totalDocuments', 'feature', 'featureSize',
    'wordCount', 'wordFrequencyCount', 'options'
  ];
  var nbdict = 
    {
      "categories":{"spam":true,"ham":true},
      "docCount":{"spam":214,"ham":214},
      "totalDocuments":428,
      "feature":{
          "the":true,
          "chicago":true,
          "hotel":true,
          "i":true,
          "a":true,
          "great":true,
          "of":true,
          "my":true,
          "was":true,
          "for":true,
          "stay":true,"at":true,"in":true,"is":true,"to":true,"as":true,"it":true,"and":true,"had":true,"from":true,"very":true,"staff":true,"with":true,"rooms":true,"room":true,"would":true,"not":true,"there":true,"were":true,"so":true,"that":true,"all":true,"":true,"num=0":true,"second-person=0%":true,"stayed":true,"this":true,"have":true,"our":true,"we":true,"they":true,"location":true,"but":true,"on":true,"t":true,"are":true,"you":true},
      "featureSize":47,
      "wordCount":{"spam":12126,"ham":12627},
      "wordFrequencyCount":{"spam":{"the":1666,"chicago":293,"hotel":443,"i":783,"a":645,"great":143,"of":348,"my":330,"was":611,"for":242,"stay":203,"at":261,"in":422,"is":263,"to":639,"as":123,"it":239,"and":974,"had":136,"from":108,"very":180,"staff":120,"with":198,"rooms":99,"room":217,"would":93,"there":110,"were":180,"so":101,"that":153,"all":116,"":207,"num=0":158,"second-person=0%":132,"this":200,"have":133,"our":115,"we":267,"they":101,"on":109,"are":115,"you":150},"ham":{"the":1850,"hotel":368,"chicago":156,"my":145,"i":491,"stayed":99,"there":117,"at":253,"and":1035,"have":117,"had":157,"a":832,"you":141,"it":272,"with":229,"in":433,"on":180,"all":101,"that":163,"are":104,"to":605,"of":378,"great":222,"room":289,"from":158,"but":125,"staff":123,"stay":156,"this":190,"is":347,"would":105,"for":337,"was":638,"":202,"we":423,"were":185,"they":100,"not":93,"location":119,"very":212,"t":95,"second-person=0%":139,"our":143}},
      "options":"review"
    }
  Naivebayes.prototype.fromJson = function (jsonStr) {
    var parsed;
    try {
      parsed = JSON.parse(jsonStr)
    } catch (e) {
      throw new Error('Naivebayes.fromJson expects a valid JSON string.')
    }
    // init a new classifier
    var classifier = new Naivebayes(parsed.options);
  
    // override the classifier's state
    STATE_KEYS.forEach(function (k) {
      if (typeof parsed[k] === 'undefined' || parsed[k] === null) {
        throw new Error('Naivebayes.fromJson: JSON string is missing an expected property: `'+k+'`.')
      }
      classifier[k] = parsed[k]
    })
    return classifier
  }
  
  let defaultTokenizer = function (text) {
    //remove punctuation from text - remove anything that isn't a word char or a space
    console.log('FALLBACK TOKENIZER IS RUNNING')
    var rgxPunctuation = /[^(a-zA-ZA-Яa-я0-9_)+\s]/g
    var sanitized = text.replace(rgxPunctuation, ' ')
    //console.log(sanitized);
    let wordlist = sanitized.split(/\s+/);
    listfeatures = wordlist.join('|').toLowerCase().split('|');
    return wordlist
  }
  
  
  let reviewTokenizer = function (text) {
    var rgxPunctuation = /[^(a-zA-ZA-Яa-я0-9_)+\s]/g
    var sanitized = text.replace(rgxPunctuation, ' ')
    //console.log(sanitized);
    let wordlist = sanitized.split(/\s+/);
    let wordslen = wordlist.length;
    let listfeatures = wordlist.join('|').toLowerCase().split('|');
    //listfeatures = [];
  
    //Additional features for reivew
    //Record the length, user cannot fake this string because punctuation is removed from words
    let flen = 'len=' + Math.round(wordslen/1).toString();
    listfeatures.push(flen);
  
    //Record the number of times a number occured in a review
    let numbercount = text.replace(/\D/g,' ').split(/\s+/).length-2;
    let fnum = "num=" + numbercount.toString();
    listfeatures.push(fnum);
  
    let povlist = [
    ['we', 'us', 'our', 'ours', 'me', 'ourselves', 'i', 'my', 'mine'],
    ['you', 'your',' yours', 'yourself', 'yourselves'],
    ['she', 'her', 'hers', 'herself', 'he', 'him', 'his', 'himself', 'it', 'its', 'they', 'them', 'their', 'theirs']
    ];
    let povcount = [0, 0, 0];
    let sumpov = 0;
    wordlist.forEach(function (word) {
      for (let j=0; j<povlist.length; j++){
        if (povlist[j].indexOf(word) != -1){
          povcount[j] += 1;
          sumpov += 1;
        }
      }
    })
    let featname = ['first-person', 'second-person', 'third-person'];
    for (let i=0; i<povcount.length; i++){
      if (sumpov)
        listfeatures.push(featname[i]+'='+ Math.round(povcount[i]*100/(sumpov))+'%');
      else
        listfeatures.push(featname[i]+'=0%');
    }
    //console.log('listfeatures');
    //console.log(listfeatures);
    return listfeatures;
  }
  
  let reviewerTokenizer = function (text) {
    var parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      throw new Error('Learn or categorize expects a valid JSON string.')
    }
    let listfeatures = [];
      //check details of username
    //length of username
    let uname = parsed.username;
    listfeatures.push("usernamelen=" + uname.length.toString());
    //number of times a digit occurred
    let numbercount = uname.replace(/\D/g,'').length;
    listfeatures.push("usernamenumcount=" + numbercount.toString());
  
  
    listfeatures.push("city=" + parsed.city);
    listfeatures.push("level=" + parsed.level.toString());
    listfeatures.push("experience=" + parsed.experience.toString());
    listfeatures.push("token_balance=" + parsed.token_balance.toString());
  
    listfeatures.push("restaurants_advertised=" + parsed.restaurants_advertised.length.toString());
    listfeatures.push("peer_review=" + parsed.peer_review.length.toString());
  
    console.log('listfeatures');
    console.log(listfeatures);
    return listfeatures;
  }
  
  function Naivebayes (datatype) {
    datatype = datatype || 0;
    this.options = datatype.toString().toLowerCase();
    if (this.options == 'review')
      this.tokenizer = reviewTokenizer;
    else if (this.options == 'reviewer')
      this.tokenizer = reviewerTokenizer;
    else
      this.tokenizer = defaultTokenizer;
    
    this.feature = {} //feature and its size
    this.featureSize = 0
    this.totalDocuments = 0 //number of documents we have learned from  
    this.docCount = {} //for each category, how often were documents mapped to it
    this.wordCount = {} //for each category, how many words total were mapped to it
    this.wordFrequencyCount = {} // for each category, how frequent was a given word mapped to it  
    this.categories = {} //hashmap of our category names
  }

  Naivebayes.prototype.initializeCategory = function (categoryName) {
    if (!this.categories[categoryName]) {
      this.docCount[categoryName] = 0
      this.wordCount[categoryName] = 0
      this.wordFrequencyCount[categoryName] = {}
      this.categories[categoryName] = true
    }
    return this
  }
  
  Naivebayes.prototype.learn = function (text, category) {
    var self = this
    //initialize category data structures if we've never seen this category
    self.initializeCategory(category)
    //update our count of how many documents mapped to this category
    self.docCount[category]++
    //update the total number of documents we have learned from
    self.totalDocuments++
    //normalize the text into a word array
    var tokens = self.tokenizer(text)
    //get a frequency count for each token in the text
    var frequencyTable = self.frequencyTable(tokens)
    /*
        Update our feature and our word frequency count for this category
     */
  
    Object
    .keys(frequencyTable)
    .forEach(function (token) {
      //add this word to our feature if not already existing
      if (!self.feature[token]) {
        self.feature[token] = true;
        self.featureSize++;
      }
  
      var frequencyInText = frequencyTable[token]
  
      //update the frequency information for this word in this category
      if (!self.wordFrequencyCount[category][token])
        self.wordFrequencyCount[category][token] = frequencyInText
      else
        self.wordFrequencyCount[category][token] += frequencyInText
  
      //update the count of all words we have seen mapped to this category
      self.wordCount[category] += frequencyInText
    })
  
    return self
  }

  Naivebayes.prototype.categorize = function (text, desiredCat, threshold, showpossibility) {
    desiredCat = desiredCat || 0;
    threshold = threshold || 0;
    showpossibility = showpossibility || 0;
  
    var self = this
      , maxProbability = -Infinity
      , chosenCategory = null
  
    var tokens = self.tokenizer(text)
    var frequencyTable = self.frequencyTable(tokens)
  
    //iterate thru our categories to find the one with max probability for this text
    let probs = [];
    let catprobs = [];
    Object
    .keys(self.categories)
    .forEach(function (category) {
  
      //start by calculating the overall probability of this category
      //=>  out of all documents we've ever looked at, how many were
      //    mapped to this category
  
      //take the log to avoid underflow
      let logProbability = Math.log(self.docCount[category]) - Math.log(self.totalDocuments);
      //now determine P( w | c ) for each word `w` in the text
      Object
      .keys(frequencyTable)
      .forEach(function (token) {
        var frequencyInText = frequencyTable[token]
        var tokenProbability = self.tokenProbability(token, category)
        //console.log(token, frequencyInText * Math.log(tokenProbability));
  
        // console.log('token: %s category: `%s` tokenProbability: %d', token, category, tokenProbability)
  
        //determine the log of the P( w | c ) for this word
        logProbability += frequencyInText * Math.log(tokenProbability)
      })
      probs.push(logProbability);
      catprobs.push([category, logProbability]);
  
      if (logProbability > maxProbability) {
        maxProbability = logProbability;
        chosenCategory = category;
      }
    })
    let returnCategory = chosenCategory;
    //calculate the prob of this category if user given the desired category and limit
    if (desiredCat != 0 && threshold != 0) {
      probs.sort();
      let secondcat = '';
      catprobs.forEach(function (catprob) {
      if (catprob[1] == probs[1]) {
        secondcat = catprob[0]
      }
      });
      console.log('['+chosenCategory+'] is e^'+ (probs[0] - probs[1]) + ' times more likely than [' + secondcat+']');
      if (probs.length > 1 && chosenCategory==desiredCat && probs[0] - probs[1] > Math.log(threshold)){
        returnCategory = desiredCat;
      } else {
        returnCategory = 'not '+ desiredCat;
      }
    }
    // if user want the probability of each category to be
    if (showpossibility) {
      //normallize each category
      let probsum = 0;
      catprobs.forEach(function (catprob) {
        catprob[1] -= maxProbability;
        catprob[1] = Math.exp(catprob[1]);
        probsum += catprob[1];
      });
      catprobs.forEach(function (catprob) {
        catprob[1] /= probsum;
      });
      return [returnCategory, catprobs];
    }
    console.log(returnCategory);
    return returnCategory;
  }
  

  Naivebayes.prototype.tokenProbability = function (token, category) {
    //how many times this word has occurred in documents mapped to this category
    let wordFrequencyCount = this.wordFrequencyCount[category][token] || 0
  
    //what is the count of all words that have ever been mapped to this category
    let wordCount = this.wordCount[category]
  
    //use laplace Add-1 Smoothing equation
    return ( wordFrequencyCount + 1) / ( wordCount + this.featureSize )
  }
  
  Naivebayes.prototype.frequencyTable = function (tokens) {
    var frequencyTable = Object.create(null)
  
    tokens.forEach(function (token) {
      if (!frequencyTable[token])
        frequencyTable[token] = 1
      else
        frequencyTable[token]++
    })
  
    return frequencyTable
  }

  Naivebayes.prototype.toJson = function () {
    let state = {};
    let self = this;
    STATE_KEYS.forEach(function (k) {
      state[k] = self[k]
    })
  
    let jsonStr = JSON.stringify(state)
  
    return jsonStr
  }
  
  Naivebayes.prototype.getSize = function () {
    let self = this;
    return self.featureSize;
  }
  
  
  Naivebayes.prototype.reduce = function () {
    let self = this;
    Object
    .keys(self.wordFrequencyCount)
    .forEach(function (label) {
      // average occurance of a feature
      let meanCount = self.wordCount[label] / (Object.keys(self.wordFrequencyCount[label]).length);
      //console.log(self.wordFrequencyCount[label]);
      Object
      .keys(self.wordFrequencyCount[label])
      .forEach(function (key) { // val occurance of this feature
        if (self.wordFrequencyCount[label][key] < 1 + 0.5 * meanCount) {
          self.wordCount[label] -= self.wordFrequencyCount[label][key];
          delete self.wordFrequencyCount[label][key];
          
          let unique = 1;
          Object
          .values(self.wordFrequencyCount)
          .forEach(function (value) {
            if (Object.keys(value).indexOf(key) != -1 ) {
              unique = 0;
            }
          });
          if (unique) {
            delete self.feature[key];
            self.featureSize -= 1;
          }
        }
      });
      //Object.keys(self.wordFrequencyCount[label]).length;
  
    });
    this.wordCount = self.wordCount;
    this.wordFrequencyCount = self.wordFrequencyCount;
    this.feature = self.feature;
    this.featureSize = self.featureSize;
    return self.featureSize;
  }

class Recovery extends Contract {

    // Init function executed when the ledger is instantiated

    async createAccount(ctx, accountname, accountKey){
      let accountBytes = await ctx.stub.getState(accountKey);
      if(accountBytes.length != 0){
        throw new Error("Accout: "+accountKey+" already exist!");
      }
      var account = {
        userId: accountKey,
        name: accountname,
        aCoin: 100,
        iteration: 0,
        reputation: 0,
        recovered: 0,
        voters: [],
        friends: []
      }
      await ctx.stub.putState(accountKey, JSON.stringify(account));
      console.log("new account: ", accountKey);
    }

    async addSecurityQuestion(ctx, accountKey, question, answer)
    {
      var accountQuestionsBytes = await ctx.stub.getState(accountKey+"-SQ");
      var accountQuestion;
      if(accountQuestionsBytes.length == 0){
        accountQuestion = {
          accountQuestionId: accountKey+"-SQ",
          QA: [[question, answer]]
        }
      }
      else{
        accountQuestion = JSON.parse(accountQuestionsBytes);
        accountQuestion.QA.push([question, answer]);
      }
      await ctx.stub.putState(accountKey+"-SQ", JSON.stringify(accountQuestion));
      return accountKey+"-SQ";
    } 

    async addMnemonicWord(ctx, accountKey, word)
    { 
      var MnemonicWordKey = accountKey + "-MW";
      var MnemonicWordBytes = await ctx.stub.getState(MnemonicWordKey);
      var MnemonicWord;
      if(MnemonicWordBytes.length == 0)
      {
        MnemonicWord = {
          MnemonicWordId: MnemonicWordKey,
          wordList: [word]
        }
      }
      else
      {
        MnemonicWord = JSON.parse(MnemonicWordBytes);
        if(MnemonicWord.wordList.length == 12)
        {
          throw new Error("number of words reach upper limit");
        }
        if(MnemonicWord.wordList.includes(word))
        {
          throw new Error("word already exists");
        }
        MnemonicWord.wordList.push(word);
      }
      await ctx.stub.putState(MnemonicWordKey, JSON.stringify(MnemonicWord));
      return MnemonicWordKey;
    }

    async queryMnemonicWord(ctx, accountKey)
    {
      var MnemonicWordKey = accountKey + "-MW";
      var MnemonicWordBytes = await ctx.stub.getState(MnemonicWordKey);
      return JSON.parse(MnemonicWordBytes);
    }

    async deleteMnemonicWord(ctx, accountKey, word)
    {
      var MnemonicWordKey = accountKey + "-MW";
      var MnemonicWordBytes = await ctx.stub.getState(MnemonicWordKey);
      if(MnemonicWordBytes.length == 0)
      {
        throw new Error("MnemonicWordKey not exist");
      }
      var MnemonicWord = JSON.parse(MnemonicWordBytes);
      for(let i=0; i<MnemonicWord.wordList.length; i++)
      {
        if(MnemonicWord.wordList[i] == word)
        {
          MnemonicWord.wordList.splice(i,1);
          break;
        }
      }
      await ctx.stub.putState(MnemonicWordKey,MnemonicWord);
      return word;
    }

    async sendMoney(ctx, senderKey, receiverKey, amount) {
        let senderBytes = await ctx.stub.getState(senderKey);
        var sender = null;
        if(senderBytes.length > 0){
            sender = JSON.parse(senderBytes);
        }
        else{
            throw new Error("Sender Unknown!");
        }
        if (sender.recovered == 1){
          throw new Error("This account has been revoked!");
        }
        if (sender.aCoin < amount){
            throw new Error('Balance is not enough');
        }
        var receiver = null;
        let receiverBytes = await ctx.stub.getState(receiverKey);
        if(receiverBytes.length > 0){
            receiver = JSON.parse(receiverBytes);
        }
        else{
            throw new Error("Receiver Unknown!");
        }
        receiver.aCoin += parseFloat(amount);
        sender.aCoin -= parseFloat(amount);
        for(let i=0; i < receiver.voters.length; i++){
          if(receiver.voters[i].userId != sender.userId && receiver.voters[i].name == sender.name){
            throw new Error('Multiple accounts for the same sender!');
          }
        }
        let dup = 0;
        for (let i = 0; i < sender.voters.length; i++){
            if (receiverKey == sender.voters[i]) {
                dup = 1;
            }
        }
        if (!dup) {
            sender.voters.push(receiverKey);
        }
        dup = 0;
        for (let i = 0; i < receiver.voters.length; i++){
            if (senderKey == receiver.voters[i]) {
                dup = 1;
            }
        }
        if (!dup) {
            receiver.voters.push(senderKey);
        }
        await ctx.stub.putState(receiverKey, CircularJSON.stringify(receiver));
        await ctx.stub.putState(senderKey, CircularJSON.stringify(sender));
    }

    async addFriends(ctx, traderKey, friendKey){
      var traderBytes = await ctx.stub.getState(traderKey);
      if(traderBytes.length == 0){
        throw new Error("Trader not exist");
      }
      var trader = JSON.parse(traderBytes);
      var friendBytes = await ctx.stub.getState(friendKey);
      if(friendBytes.length == 0){
        throw new Error("Friend not exist");
      }
      trader.friends.push(friendKey);
      if(!trader.voters.includes(friendKey)){
        trader.voters.push(friendKey);
      }
      await ctx.stub.putState(traderKey, JSON.stringify(trader));
    }
  
    async removeFriends(ctx, traderKey, friendKey){
      var traderBytes = await ctx.stub.getState(traderKey);
      if(traderBytes.length == 0){
        throw new Error("Trader not exist");
      }
      var trader = JSON.parse(traderBytes);
      var friendBytes = await ctx.stub.getState(friendKey);
      if(friendBytes.length == 0){
        throw new Error("Friend not exist");
      }
      for(var i=0; i<trader.friends.length; i++){
        if(trader.friends == friendKey){
          trader.splice(i,1);
        }
      }
      await ctx.stub.putState(traderKey, JSON.stringify(trader));
    }

    async queryTrader(ctx, traderKey){
        let traderBytes = await ctx.stub.getState(traderKey);
        if(traderBytes.length == 0){
            return "Not exist";
        }
        else{
          var trader = JSON.parse(traderBytes);
          console.log("name: ", trader.name, " money: ", trader.aCoin );
          console.log("voters: ", trader.voters);
          return "name: "+trader.name+" money: "+trader.aCoin;
        }
    }

    async querySQ(ctx, questionKey)
    {
      var questionBytes = await ctx.stub.getState(questionKey);
      if(questionBytes.length <= 0){
        throw new Error("Security Question Key not exist");
      }
      var question = JSON.parse(questionBytes);
      console.log(question.QA);
      return question.QA;
    }


    async recoverAccount(ctx, proposalName, sos, detail, initiator, oldAccount) {
      
      let nbclassifier = new Naivebayes();
      var nbcstr = fs.readFileSync('nb.json', 'utf8');
      try {
          nbclassifier = nbclassifier.fromJson(nbcstr);
          console.log(nbclassifier);
      } catch (e) {
          throw new Error('ERROR: Naivebayes.fromJson expects a valid JSON string');
      }
      if (nbclassifier.categorize(detail, 'spam', 10) == 'spam'){
          throw new Error('The poll has failed the spam detection');
      }
      let sdate = new Date(Date.now());
      let edate = new Date(Date.parse(sdate));
      edate.setMonth(edate.getMonth() + 1);
      console.log(sdate);
      console.log(edate);

      let oldAccountBytes = await ctx.stub.getState(oldAccount);
      if(oldAccountBytes.length == 0){
        throw new Error("Old account not found!");
      }
      var oldAccountUser = JSON.parse(oldAccountBytes);

      var votesLength = oldAccountUser.voters.length;
      if(oldAccountUser.friends.length > 10){
        votesLength = oldAccountUser.friends.length;
      }
      var newPollKey = proposalName+"-Poll";
      var newPoll = {
        pollID: proposalName+"-Poll",
        detail: detail,
        deadline: edate,
        result: '',
        host: initiator,
        up: 0,
        down: 0, 
        quantity: votesLength
      };
      await ctx.stub.putState(newPollKey, JSON.stringify(newPoll));
      console.log("new poll inserted!");
  
      var newProposalKey = proposalName;
      var newProposal = {
        proposalID: proposalName,
        statementOS: sos,
        detail: detail,
        newAccount: initiator,
        oldAccount: oldAccount,
        detailpoll: proposalName+"-Poll"
      };
      await ctx.stub.putState(newProposalKey, JSON.stringify(newProposal));
      console.log("new proposal inserted!");
      
      if(oldAccountUser.friends.length > 10){
        for(var i=0; i<oldAccountUser.friends.length; i++){
          let vtID = 'VT-' + proposalName + '-' + oldAccountUser.friends[i];
          var newVoteTokenKey = vtID;
          var newVoteToken = {
            votetokenID: vtID,
            response: '',
            poll: newPollKey,
            deadline: newPoll.deadline,
            creator: initiator,
            owner: oldAccountUser.friends[i]
          };
          await ctx.stub.putState(newVoteTokenKey, JSON.stringify(newVoteToken));
          console.log("new vote token for ", oldAccountUser.friends[i], " inserted!");
        }
      }
      else{
        let i = 0;
        for (;i < oldAccountUser.voters.length; i++){
            let vtID = 'VT-' + proposalName + '-' + oldAccountUser.voters[i];
            var newVoteTokenKey = vtID;
            var newVoteToken = {
              votetokenID: vtID,
              response: '',
              poll: newPollKey,
              deadline: newPoll.deadline,
              creator: initiator,
              owner: oldAccountUser.voters[i]
            };
          await ctx.stub.putState(newVoteTokenKey, JSON.stringify(newVoteToken));
          console.log("new vote token for ", oldAccountUser.voters[i], " inserted!");
          }
      }
    }

    async PollIsFinished(ctx, proposalKey)
    {
      var pollKey = proposalKey + "-Poll";
      var pollBytes = await ctx.stub.getState(pollKey);
      if(pollBytes.length > 0)
      {
        var poll = JSON.parse(pollBytes);
        if(poll.result != '')
        {
          return poll.result;
        }
        return "Poll does not have result yet";
      }
      return "Poll not exist";
    }

    async PollProgress(ctx, proposalKey)
    {
      var pollKey = proposalKey + "-Poll";
      var pollBytes = await ctx.stub.getState(pollKey);
      if(pollBytes.length > 0)
      {
        var poll = JSON.parse(pollBytes);
        return [poll.up, poll.down];
      }
      return "Poll not exist";
    }

    async voteForPoll(ctx, proposalName, traderKey, res) {
      var proposalBytes = await ctx.stub.getState(proposalName);
      if(proposalBytes.length == 0){
        throw new Error("proposal not exist");
      }
      var proposal = JSON.parse(proposalBytes);
      var oldAccountBytes = await ctx.stub.getState(proposal.oldAccount);
      if(oldAccountBytes.length == 0){
        throw new Error("old account not exist");
      }
      var oldAccount = JSON.parse(oldAccountBytes);
      var Weight = 1;
      if(oldAccount.friends.length <= 10){
        if(oldAccount.friends.includes(traderKey)){
          Weight = 0.6 / (oldAccount.friends.length);
        }
        else{
          Weight = 0.4 / (oldAccount.voters.length - oldAccount.friends.length);
        }
      }
      var voteTokenKey = 'VT-' + proposalName + '-' + traderKey;
      let voteTokenBytes = await ctx.stub.getState(voteTokenKey);
      if(voteTokenBytes.length == 0){
        throw new Error("Vote token not exist");
      }
      var voteToken = JSON.parse(voteTokenBytes);
      if (voteToken.deadline != '') {
        let ddldate = new Date(voteToken.deadline);
        ddldate = ddldate.getTime();
        if (Date.now() > ddldate) {
            throw new Error('Poll deadline already past');
        }
      }
      var pollKey = proposalName + "-Poll";
      console.log("get pollKey: ", pollKey);
      let pollBytes = await ctx.stub.getState(pollKey);
      if(pollBytes.length == 0){
        throw new Error("poll not exist!");
      }
      var poll = JSON.parse(pollBytes);
      if(voteToken.creator.recovered == 1 || voteToken.owner.recovered == 1){
        console.log("vote token's creator or owner account is no longer used!");
        poll.quantity -= 1;
        await ctx.stub.putState(poll);
        return;
      }
      
      
      // Encrypt the vote
      if(voteToken.response != ''){
        throw new Error("Already voted!");
      }
      // if (vote.votetoken.poll.rsakey.n != '') {
      //     response = RSAencrypt(vote.response, vote.votetoken.poll.rsakey);
      //     console.log('Vote is encrypted');
      // }
     
      // vote.votetoken.owner = vote.votetoken.creator;
      // if (response == ''){
      //     console.log('Vote is not encrypted');
      //     response = vote.response;
      // }
      voteToken.response = res;
      console.log("received vote: ", res);
      if(res == false){
        poll.down += Weight;
      }
      else{
        poll.up += Weight;
      }
      poll.quantity -= 1;
      await ctx.stub.putState(pollKey, JSON.stringify(poll));
      console.log("poll ", pollKey, " updated: ", poll.quantity);
      await ctx.stub.putState(voteTokenKey, JSON.stringify(voteToken));
      console.log("vote token ", voteToken.votetokenID, " responsed with ", res, "!");
      return [poll.up, poll.down];
    }



    async finishRecovery(ctx, proposalKey) {
    
      // let proposalBytes = ctx.stub.getState(proposalKey);
      // var proposal;
      // if(proposalBytes.length > 0){
      //   proposal = JSON.parse(proposalBytes);
      // }
      // else{
      //   throw new Error("Proposal not exist!");
      // }
      var pollKey = proposalKey + "-Poll";
      let pollBytes = await ctx.stub.getState(pollKey);
      if(pollBytes.length == 0){
        throw new Error("poll not exist!");
      }
      var poll = JSON.parse(pollBytes);
      if(poll.quantity != 0){
        let ddldate = new Date(voteToken.deadline);
        ddldate = ddldate.getTime();
        if (Date.now() < ddldate) {
          throw new Error("votes remaining: ", poll.quantity);
        }
      }
      let proposalBytes = await ctx.stub.getState(proposalKey);
      if(proposalBytes.length == 0){
        throw new Error("proposal ", proposalKey, " not exist!");
      }
      var proposal = JSON.parse(proposalBytes);
      if(poll.up > poll.down){
        console.log("account voting successfully: ", poll.up, ":", poll.down);
        poll.result = true;
      }
      else{
        poll.result = false;
      }
      await ctx.stub.putState(pollKey, JSON.stringify(poll));
      return [poll.up,poll.down];
    }

    async transferAccount(ctx, oldAccountKey, newAccountKey, detail)
    {
      var oldAccountBytes = await ctx.stub.getState(oldAccountKey);
      var newAccountBytes = await ctx.stub.getState(newAccountKey);
      if(oldAccountBytes.length == 0 || newAccountBytes.length == 0){
        throw new Error("account not exist!");
      }
      var oldAccount = JSON.parse(oldAccountBytes);
      var newAccount = JSON.parse(newAccountBytes);
      newAccount.aCoin = oldAccount.aCoin*0.9;
      oldAccount.aCoin = 0;
      oldAccount.recovered = 1;
      newAccount.iteration += 1;
      await ctx.stub.putState(proposal.newAccount, CircularJSON.stringify(newAccount));
      await ctx.stub.putState(proposal.oldAccount, CircularJSON.stringify(oldAccount));
      let nbclassifier = new Naivebayes();
      var nbcstr = fs.readFileSync('nb.json', 'utf8');
      try {
          nbclassifier = nbclassifier.fromJson(nbcstr);
      } catch (e) {
          throw new Error('ERROR: Naivebayes.fromJson expects a valid JSON string');
      }
      nbclassifier.learn(detail, "true");
      var jsonnb = nbclassifier.toJson();
      fs.writeFileSync('nb.json', jsonnb); 
    }

      async instantiate(ctx) {
        console.log("Initiate Start");
        var traderKey = 'Alice0';
        var trader = { 
              userId: 'Alice0', 
              name: 'Alice',
              aCoin: 100,
              iteration: 0,
              reputation: 0,
              recovered: 0,
              voters: [],
              friends: []
        };
        await ctx.stub.putState(traderKey, JSON.stringify(trader));
        traderKey = 'Bob0';
        trader = { 
              userId: 'Bob0', 
              name: 'Bob',
              aCoin: 100,
              iteration: 0,
              reputation: 0,
              recovered: 0,
              voters: [],
              friends: []
        };
        await ctx.stub.putState(traderKey, JSON.stringify(trader));
        traderKey = 'Cat0';
        trader = { 
              userId: 'Cat0', 
              name: 'Cat',
              aCoin: 100,
              iteration: 0,
              reputation: 0,
              recovered: 0,
              voters: [],
              friends: []
        };
        await ctx.stub.putState(traderKey, JSON.stringify(trader));
        // this.sendMoney("Alice0", "Bob0", "10");
        // this.sendMoney("Alice0", "Cat0", "10");
        // this.sendMoney("Cat0", "Bob0", "10");
        // this.createAccount("Alice", "Alice1");
        // this.recoverAccount("proposal0", "sss", "ddd", "Alice1", "Alice0");
        var nbjson = JSON.stringify(nbdict);
        fs.writeFileSync('nb.json', nbjson); 
        console.log("Initiate Ends");
    }
  
    //   async refuseRecovery(vetoRecovery) {
    //     const frauds = await query('selectProposalsbyOldAccount', { ouID: vetoRecovery.owner.userId });
    //     let fraud = frauds[0];
    //     const newus = await query('selectMatchingUser', { uID: fraud.newAccount });
    //     let newu = newus[0];
    //     console.log(newu.userId);
    //     newu.reputation = 0;
    //     let assetRegistry = await getParticipantRegistry('org.example.basic.User');
    //     await assetRegistry.update(newu);
    //     assetRegistry = await getAssetRegistry(fraud.getFullyQualifiedType());
    //     await assetRegistry.remove(fraud);
    //   }

    // async createANewPoll(ctx, pollId, detail, deadline, result, rsaKey, pollOwnerKey) {
    //     let pollOwnerBytes = ctx.stub.getState(pollOwnerKey);
    //     var pollOwner;
    //     if(pollOwnerBytes.length > 0){
    //       pollOwner = JSON.parse(pollOwnerBytes);
    //     } 
    //     else{
    //       throw new Error("poll owner not exist");
    //     }
    //     if (pollOwner.recovered == 1){
    //       throw new Error("Poll creator's account has been revoked!");
    //     }
    //     pollKey = pollId;
    //     poll = {
    //           pollId: pollId,
    //           detail: detail,
    //           deadline: deadline,
    //           result: result,
    //           rsaKey: rsakey,
    //           pollOwnerKey: pollOwnerKey
    //     };
    //     console.log('create new poll');
    //     await ctx.stub.putState(pollId, JSON.stringify(poll));
    //     let nbclassifier = new Naivebayes();
    //     const nbcf = await query('selectNBclassifier', { nbcID: "nbc-public" });
    //     let nbcstr = nbcf[0].jsondata.replace(/'/g, '"');
    //     try {
    //         nbclassifier = nbclassifier.fromJson(nbcstr);
    //     } catch (e) {
    //         throw new Error('ERROR: Naivebayes.fromJson expects a valid JSON string');
    //     }
    
    //     if (nbclassifier.categorize(detail, 'spam', 10) == 'spam'){
    //         throw new Error('The poll has failed the spam detection');
    //     }
    
    //     const factory = getFactory();
      
    //     // Below is specific to the network (to be edited)
    //     const namespace = 'org.example.basic';
      
    //     const newpoll = factory.newResource(namespace, 'Poll', createPoll.pollName);
    //     newpoll.pollID = createPoll.pollName;
    //     newpoll.host = createPoll.pollOwner;
    //     newpoll.detail = createPoll.pollDetail;
    //     //check if the poll has deadline 
    //     let ddldate = new Date(createPoll.pollDeadline);
    //     if (ddldate == 'Invalid Date') { //No deadline specified or incorrect date format
    //         newpoll.deadline = '';
    //     } else if (Date.now() > ddldate.getTime()) {
    //         throw new Error('Cannot set deadline prior to current time');
    //     } else {
    //         newpoll.deadline = createPoll.pollDeadline;
    //     }
    //     newpoll.result = '';
      
    //     // ENCRYPTION
    //     const newrsakey = factory.newResource(namespace, 'RSAKey', 'RSA-' + createPoll.pollName);
    //     newrsakey.rsakeyID = 'RSA-' + createPoll.pollName;
    //     newrsakey.n = createPoll.publicKey;
    //     newrsakey.e = 10001;
    //     newrsakey.d = '';
    //     newrsakey.p = '';
    //     newrsakey.q = '';
    //     newrsakey.dmp1 = '';
    //     newrsakey.dmq1 = '';
    //     newrsakey.coeff = '';
      
    //     let assetRegistry = await getAssetRegistry(newrsakey.getFullyQualifiedType());
    //     await assetRegistry.add(newrsakey);
    //     newpoll.rsakey = newrsakey;
      
    //     assetRegistry = await getAssetRegistry(newpoll.getFullyQualifiedType());
    //     await assetRegistry.add(newpoll);
       
    //     // creat votetoken for each voter
    //     let i = 0;
    //     for (;i < createPoll.voters.length; i++){
    //         let vtID = 'VT-' + createPoll.pollName + '-' + i.toString();
    //         const newVoteToken = factory.newResource(namespace, 'VoteToken', vtID);
    //         newVoteToken.creator = createPoll.pollOwner;
    //         newVoteToken.poll = newpoll;
    //         newVoteToken.response = '';
    //         newVoteToken.owner = createPoll.voters[i];
    //         assetRegistry = await getAssetRegistry(newVoteToken.getFullyQualifiedType());
    //         await assetRegistry.add(newVoteToken);
    //     }
    // }

    // async voteForPoll(ctx, vote) {

    //     //check the deadline
    //     if(vote.votetoken.owner.recovered == 1){
    //       throw new Error("Vote owner's account has been revoked!");
    //     }
    //     if (vote.votetoken.poll.deadline != '') {
    //         let ddldate = new Date(vote.votetoken.poll.deadline);
    //         ddldate = ddldate.getTime();
    //         if (Date.now() > ddldate) {
    //             throw new Error('Poll deadline already past');
    //         }
    //     }
        
    //     // Encrypt the vote
    //     let response ='';
    //     if (vote.votetoken.poll.rsakey.n != '') {
    //         response = RSAencrypt(vote.response, vote.votetoken.poll.rsakey);
    //         console.log('Vote is encrypted');
    //     }
       
    //     vote.votetoken.owner = vote.votetoken.creator;
    //     if (response == ''){
    //         console.log('Vote is not encrypted');
    //         response = vote.response;
    //     }
    //     vote.votetoken.response = response;
    //     const assetRegistry = await getAssetRegistry('org.example.basic.VoteToken');
    //     // persist the state of the votetoken
    //     await assetRegistry.update(vote.votetoken);
    // }

    // async RevealPollSecretKey(ctx, revealkey) {
    //     //check the deadline
    //     if (revealkey.poll.deadline != ''){
    //         let ddldate = new Date(revealkey.poll.deadline);
    //         ddldate = ddldate.getTime();
    //         if (Date.now() < ddldate) {
    //             throw new Error('Cannot reveal the key before poll deadline');
    //         }
    //     }
      
    //     const factory = getFactory();
    //     const namespace = 'org.example.basic';
    //     let id = revealkey.poll.rsakey.rsakeyID;
    //     let n = revealkey.poll.rsakey.n;
    //     let e = revealkey.poll.rsakey.e;
        
    //     const newrsakey = factory.newResource(namespace, 'RSAKey', id + '-P');
    //     newrsakey.rsakeyID = id + '-P';
    //     newrsakey.n = n;
    //     newrsakey.e = e;
    //     let d = revealkey.d;
    //     let p = revealkey.p;
    //     let q = revealkey.q;
    //     newrsakey.d = d;
    //     newrsakey.p = p;
    //     newrsakey.q = q;
    //     d = parseBigInt(d,16);
    //     p = parseBigInt(p,16);
    //     q = parseBigInt(q,16);
    //     let p1 = p.subtract(BigInteger.ONE);
    //     let q1 = q.subtract(BigInteger.ONE);
    //     let dmp1 = d.mod(p1);
    //     let dmq1 = d.mod(q1);
    //     let coef = q.modInverse(p);
    //     newrsakey.dmp1 = dmp1.toString();
    //     newrsakey.dmq1 = dmq1.toString();
    //     newrsakey.coeff = coef.toString();
        
    //     // test if the private key is correct before update to the RSAkey
    //     let test = 'Test RSA encryption';
    //     let ctest = RSAencrypt(test, newrsakey);
    //     ctest = RSAdecrypt(ctest, newrsakey);
    //     if (test != ctest) {
    //         throw new Error('Incorrect public/secret key pair, please try again');
    //     }
    //     console.log('Publishing private key...');
        
    //     let assetRegistry = await getAssetRegistry(revealkey.poll.rsakey.getFullyQualifiedType());
    //     await assetRegistry.remove(revealkey.poll.rsakey);
        
    //     assetRegistry = await getAssetRegistry(newrsakey.getFullyQualifiedType());
    //     await assetRegistry.add(newrsakey);
    //     revealkey.poll.rsakey = newrsakey;
    
    //     assetRegistry = await getAssetRegistry(revealkey.poll.getFullyQualifiedType());
    //     // persist the state of the votetoken
    //     await assetRegistry.update(revealkey.poll);
    // }
    
    // async CompleteThePoll(ctx, completePoll) {
    //     console.log('completePoll');
        
    //     //check the deadline
    //     if (completePoll.poll.deadline != ''){
    //         let ddldate = new Date(completePoll.poll.deadline);
    //         ddldate = ddldate.getTime();
    //         if (Date.now() < ddldate) {
    //             throw new Error('Cannot complete the poll before its deadline');
    //         }
    //     }
    
    //     let encrypted = false;
    //     if (completePoll.poll.rsakey.n != ''){
    //         console.log("Decrypting votes...");
    //         encrypted = true;
    //     }
    
    //     const votetokens = await query('selectMatchingVoteTokens');
    //     if (votetokens.length >= 1 && completePoll.poll.result == '') {
            
    //         const qualifiedVT = votetokens.filter(function (votetoken) {
    //             return (votetoken.poll.getIdentifier() == completePoll.poll.getIdentifier()) && (votetoken.owner.getIdentifier() == completePoll.poll.host.getIdentifier());
    //         });
            
    //         let answers = {};
    //         for (let i = 0; i < qualifiedVT.length; i++) {
    //             //console.log(qualifiedVT[i].poll.getIdentifier());
    //             let response = qualifiedVT[i].response;
    
    //             // decrypt the vote
    //             if (encrypted) {
    //                 response = RSAdecrypt(response, completePoll.poll.rsakey);
    //             }
    //             answers[response] = 1 + (answers[response] || 0);
                
    //             let assetRegistry = await getAssetRegistry(qualifiedVT[i].getFullyQualifiedType());
    //             await assetRegistry.remove(qualifiedVT[i]);
    //         }
    //         let maxv = 0;
    //         let maxk = '';
    //         try {
    //             for (let ans in answers) {
    //                 console.log(ans, answers[ans]);
    //                 if (answers[ans] > maxv){
    //                     maxv = answers[ans];
    //                     maxk = ans;
    //                 } else if (answers[ans] == maxv){
    //                     maxk = maxk + ", " + ans;
    //                 }
    //             }
    //         }
    //         catch(error) {
    //             console.error(error);
    //         }
    
    //         console.log(maxk, maxv);
    //         completePoll.poll.result = maxk;
            
    //         //const assetRegistry = await getAssetRegistry('org.example.basic.Poll');
    //         // persist the state of the votetoken
    //         //await assetRegistry.update(completePoll.poll);
    
    
    //         let nbclassifier = new Naivebayes();
    //         // get the wanted classifier
    //         const nbcf = await query('selectNBclassifier', { nbcID: "nbc-public" });
    //         console.log('nbcf');
    //         console.log(nbcf);
    //         let nbcstr = nbcf[0].jsondata.replace(/'/g, '"');
    //         try {
    //             nbclassifier = nbclassifier.fromJson(nbcstr);
    //         } catch (e) {
    //             throw new Error('ERROR: Naivebayes.fromJson expects a valid JSON string');
    //         }
    
    //         nbclassifier.learn(completePoll.poll.pollDetail, maxk);
    //         console.log(nbclassifier);
    //         let jsonnb = nbclassifier.toJson();
    //         jsonnb = jsonnb.replace(/'/g, '"');
    //         console.log(jsonnb);
    
    
            
    //     } else {
    //         throw new Error('Poll already concluded or no voters has voted yet');
    //     }
    // }
}

module.exports = Recovery;