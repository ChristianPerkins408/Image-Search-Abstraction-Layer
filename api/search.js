module.exports = function(app, db) {
  var request = require('request');
  app.get("/api/imagesearch/:query(*)", function(req, res) {
    var q = req.params.query;
    var start = req.query.offset;
    var url = "";
    if (start) {
      url = 'https://www.googleapis.com/customsearch/v1' + '?key=' + process.env.CSE_API_Key + '&cx=' + process.env.CSE_ID + '&searchType=image' + '&q=' + q + '&start=' + start;
    } else {
      url = 'https://www.googleapis.com/customsearch/v1' + '?key=' + process.env.CSE_API_Key + '&cx=' + process.env.CSE_ID + '&searchType=image' + '&q=' + q;
    }
    var requestObject = {
      uri: url,
      method: 'GET',
      timeout: 10000
    };
    request(requestObject, function(error, response, body) {
      if (error) {
        throw (error);
      } else {
        var d = new Date();
        var date = d.toJSON();
        var query = {
          "term": q,
          "time": date
        };
        var collection = db.collection('imagequeries');
        collection.insert(query, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('Inserted %d documents into the imagequeries collection. The documents inserted with "_id" are:', result.length, result);
          }
        });
        var array = [];
        var result = JSON.parse(body);
        var imageList = result.items;
        for (var i = 0; i < imageList.length; i++) {
          var image = {
            "url": imageList[i].link,
            "snippet": imageList[i].snippet,
            "thumbnail": imageList[i].image.thumbnailLink,
            "context": imageList[i].displayLink
          };
          array.push(image);
        }
        res.send(array);
      }
    });
  });
};
