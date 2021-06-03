'use strict';
const axios = require('axios');
module.exports.cancelOrder = async (event) => {
  try{
    var cancelJson = convertionJson(event);
  const response = await doRequest(cancelJson);
    console.info("CancelOrder   Success");
    return response;
 
  }
  catch (error) {
    console.info("Create Order Faild");
    var count = 0;
    var maxTries = 3;
    while (count < 3) {
       console.log("loop")
       console.info(count);
       try {
        var cancelJson = convertionJson(event);
          const response = await doRequest(cancelJson );
          return response;

       } catch (err) {
          count = count + 1;
          if (count == maxTries) {
            try{
            var statuscode = (err.response.status) ? err.response.status : 400;
             var statusError = (err.response.data) ? err.response.data : "something went wrong";
             return ({ statusCode: statuscode, body: JSON.stringify(statusError) });
            }
            catch{
              return ({ statusCode: 400, body: JSON.stringify("something went wrong") });
            }

          }
       }
    }
 }

  };

function convertionJson(event){
  try{
  var eventreq=JSON.parse(event.body);
  var cancelJson={};
  var orderSelectRequest={};
  var filters=[];
  var values=[];
  values.push(eventreq.data.channel_order_id)
  filters.push({
   name:"id",
    operation:"EQUALS",
    values:values
  })
 
  orderSelectRequest.filters=filters;
  cancelJson.orderStatus="CANCELLED";
  cancelJson.orderSelectRequest=orderSelectRequest;
  console.info(JSON.stringify(cancelJson));

  return cancelJson;
  }
  catch(error){
    console.log(error);
  }
}
  function doRequest(cancelData) {
    try {
       
       const clientId = 'arki-devo';
       const username = 'arki-devo'
       const password = '167eb8d0-aab4-44e0-99c4-0469945d2bae'
       const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
      
       const url = 'https://oms.locus-api.com/v1/client/' + clientId + '/order-status-update'
       const response = new Promise((resolve, reject) => {
          axios.post(url, cancelData, {
 
             headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`
             }
          }).then((res) => {
             console.info("Locus URl Success");
             resolve({
                statusCode: 200,
                body: JSON.stringify(res.data)
             });
          })
             .catch((error) => {
                console.info("Locus URl Error");
                console.log(error);
                reject(error);
             });
       })
       console.info("cancel order response");
       console.info(response);
       return response;
    }
    catch (error) {
     
       console.error(error);
       console.error("doRequest Catch Handling");
 
    }
 
 }
 
