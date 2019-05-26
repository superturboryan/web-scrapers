const request = require("request")
const cheerio = require("cheerio")

//Scrape and list the top 500 users of CodeWars

request("https://www.codewars.com/users/leaderboard", (error, response, html) => {
   if (!error && response.statusCode == 200) {
      // console.log(html)

      const $ = cheerio.load(html)

      console.log("Top 500 CodeWars users by honor")
      $("tbody tr td.is-big a").each((i, el) => {

         const username = $(el).attr("href").substr(7)

         console.log((i + 1) + ")", username)
      })

   }
})