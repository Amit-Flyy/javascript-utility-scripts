const { log } = require('console');
var fs = require('fs');

var args = process.argv;
var type = args[2] || 'text';
var ans_arr = []; 
var bufferString; 

function csvHandler(){
  fs.readFile('new_test.csv',function (err,data) {

    if (err) {
      return console.log(err);
    }
    bufferString = data.toString(); 
    ans_arr = bufferString.split('\n'); 
    var ans_keys = ans_arr[0].split(',');
    // console.log('---->', ans_arr.length);
    ans_arr = ans_arr.slice(1, ans_arr.length);
    // console.log(ans_arr.length);
    fs.readFile('mainInvoice.csv',function (err, inv_data) {

      if (err) {
        return console.log(err);
      }
      bufferString = inv_data.toString(); 
      var inv_arr = bufferString.split('\n'); 
      var inv_col = ans_arr[0].split(',');
      inv_arr = inv_arr.slice(1, inv_arr.length)

      // var filler_arr = 
    
    });

    
    // var main_obj = 
  
  });
}

csvHandler()