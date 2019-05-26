const rp = require("request-promise");
const cheerio = require("cheerio")
const Table = require("cli-table");

let table = new Table({
   head: ["username", "<3", "challenges"],
   colWidths: [15, 5, 15]
})

const options = {
   url: "https://www.freecodecamp.org/forum/directory_items?period=weekly&order=likes_received&_=1558836903691",
   json: true,
}

rp(options)
   .then((data) => {
      let userData = [];
      for (let user of data.directory_items) {
         userData.push({ name: user.user.username, likes_received: user.likes_received })
      }

      process.stdout.write("loading")
      getChallengesCompleteAndPushToUserArray(userData);
   })
   .catch((err) => {
      console.log(err)
   })

function getChallengesCompleteAndPushToUserArray(userData) {

   var i = 0;

   function next() {
      if (i < userData.length) {
         var options = {
            url: "https://www.freecodecamp.org/" + userData[i].name,
            transform: body => cheerio.load(body)
         }
         rp(options)
            .then(function ($) {
               process.stdout.write(".")
               const fccAccount = $("h1.landing-heading").length == 0
               const challengesPassed = fccAccount ? $("tbody tr").length : "Unknown"

               table.push([userData[i].name, userData[i].likes_received, challengesPassed])
               ++i
               return next()
            })
      }
      else {
         printData()
      }
   }

   return next();
}

function printData() {
   console.log("🔧")
   console.log(table.toString())
}