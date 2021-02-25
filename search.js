
async function search(){

      var searchPromise = new Promise(async (resolve, reject) => {
          $.ajax({
              url: "https://api.inaturalist.org/v1/observations?photos=true&project_id=97146&order=desc&order_by=created_at",
              success: function(data) {
                observations = data.results;
                console.log(data)
                resolve();
              }
          });
      });
      return searchPromise;

}

async function airtableSearch(){

  var airtablePromise = new Promise((resolve, reject) => {
    $.ajax({
      url:"https://api.airtable.com/v0/appIRHtaHUcrpPCvK/Observation?api_key=keyQSVeKTIgDnDvgT",
      success: function(data){
        for(var i = 0; i < data.records.length; i++){
          observations.push(data.records[i].fields);
        }
        resolve();
      }
    })
  });
  return airtablePromise;
}
