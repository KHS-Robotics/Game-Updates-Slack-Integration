var request = require('request-promise');
var cheerio = require('cheerio');

function extractDate(str) {
  var date = str.substring(str.lastIndexOf("d") + 1,str.lastIndexOf(")")).trim();

  return date;
};

var options = {
  uri: undefined,
  transform: function (body) {
      return cheerio.load(body);
  }
};

var scraper = {
  getLatestTeamUpdates: function(uri, callback) {
    options.uri = uri;

    var result = [];

    request(options)
      .then(function ($) {

        $('.field-name-body tbody tr:nth-child(5) td ul li a').each(function(anchorTag, elem) {

          var date = extractDate($(this).parent().text());
          var title = $(this).text();
          var url = $(this).attr('href');

          result.push({ "title" : title, "date": date, "url": url });

        });

        callback(null, JSON.parse(JSON.stringify({"team_updates": result })));
      })
      .catch(function(err) {
        console.log("Something went wrong: " + err);
        callback(err, null);
      });

    options.uri = undefined;
  }
}

module.exports = scraper;
