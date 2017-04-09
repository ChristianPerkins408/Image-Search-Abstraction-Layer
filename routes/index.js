module.exports = function(app, db) {

  var path = process.cwd();

  app.get('/api/latest/imagesearch', function(req, res) {
  //route for the latest 10 searches

    //an array to hold the results
    var array = [];

    //connect to the imagequeries collection
    var collection = db.collection('imagequeries');

    //find the 10 last searches and save as a cursor
    var cursor = collection.find().limit(10).sort({
      _id: -1
    });

    cursor.forEach(function(doc) {
    //loop through each cursor and construct result object for each one (we dont want the ID, only term and time)

      var lastQuery = {

        "term": doc.term,
        "time": doc.time

      };


      //push results object to array
      array.push(lastQuery);

      //when the loop makes the array have 10 results, send the array to display on browser
      if (array.length === 10) {

        res.send(array);

      }

    });



  });


};
