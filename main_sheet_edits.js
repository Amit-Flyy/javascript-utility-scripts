const { log } = require('console');
var fs = require('fs');

var args = process.argv;
var type = args[2] || 'text';
var arr = []; 
var bufferString; 

function csvHandler(){
  fs.readFile('sample.csv',function (err,data) {

  if (err) {
    // return console.log(err);
  }

  //Convert and store csv information into a buffer. 
  bufferString = data.toString(); 

  //Store information for each individual person in an array index. Split it by every newline in the csv file. 
  arr = bufferString.split('\n'); 

//   for (i = 0; i < arr.length; i++) { 
//     JSON.stringify(arr[i]); 
//   }

//   var obj = JSON.parse(arr);
  
  console.log(arr[0]);
  
});
}

csvHandler()