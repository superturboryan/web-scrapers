const request = require("request")
const cheerio = require("cheerio")
const fs = require("fs")
const writeStream = fs.createWriteStream("Top500CodeWars.csv")

const timeStamp = new Date().toLocaleDateString

//Write headers
writeStream.write("Top 500 users of CodeWars by honor \n")
writeStream.write("Date: " + timeStamp)

//Scrape and list the top 500 users of CodeWars

request("https://www.codewars.com/users/leaderboard", (error, response, html) => {
   if (!error && response.statusCode == 200) {
      // console.log(html)

      const $ = cheerio.load(html)

      $("tbody tr td.is-big a").each((i, el) => {

         const username = $(el).attr("href").substr(7)

         //Write to csv
         writeStream.write(`${i}) ${username}`)
      })

      console.log("Scraping done")
   }
})