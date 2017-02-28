'use strict';
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var messages = [];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];
  
  // See the note below about CORS headers.
  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };
  
  var responseHeaders = defaultCorsHeaders;
  responseHeaders['Content-Type'] = 'application/json';
  // The outgoing status.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // handle all GET requests
  if (method === 'GET') {
    if (url === '/classes/messages') {
    
      request.on('error', function(err) {
        console.log(err);
      });
      request.on('data', function(chunk) {
        body.push(chunk);
      });
      request.on('end', function() {

        // response.on('error', function(err) {
        //   console.error(err);
        // });
        
        
        let statusCode = 200;
        
        response.writeHead(statusCode, responseHeaders);
        
        var responseBody = {
          headers: headers,
          method: method,
          url: url,
          results: messages
        };
        //console.log(body);
        response.end(JSON.stringify(responseBody));
      });

    } else {
      let statusCode = 404;

      response.writeHead(statusCode, responseHeaders);

      response.end();
    }
  } else if (method === 'POST' && url === '/classes/messages') {
    request.on('error', function(err) {
      console.log(err);
    });
    request.on('data', function(chunk) {
      body.push(chunk);
    });
    request.on('end', function() {

      // response.on('error', function(err) {
      //   console.error(err);
      // });

      let statusCode = 201;

      response.writeHead(statusCode, responseHeaders);

      messages.push(JSON.parse(body));
      console.log(messages);
      response.end(JSON.stringify(body));
      

    });


  } else if (method === 'OPTIONS') {
    request.on('error', function(err) {
      console.log(err);
    }).on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {

      // response.on('error', function(err) {
      //   console.error(err);
      // });

      let statusCode = 200;

      response.writeHead(statusCode, responseHeaders);

      response.end();
    });
  }
  
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

module.exports.requestHandler = requestHandler;

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

