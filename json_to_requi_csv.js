var fs = require('fs');
var main_arr = [], csv_obj = {}, sls, listval = [], prev, max_row = 0, i, line_item = 1001;

var plans = ['Avail-Finance-ARE', 'Enterprise-Plan-For-Existing', 'Enterprise-With-Former-Pricing', 'Kotak-retention-plan-MPU-based', 'Moms-Presso-MyMoCard-INR-Monthly']
var thisObj = {
    'medcords': 0,
    'mintpro': 1,
    'momspresso': 2,
    'taxbuddy': 3,
    'stucred': 4,
    'hirehunch': 5,
    'oto': 6,
    'cashe': 7,
    'avail': 8,
    'pharmarack': 9,
    'mypaisaa': 10,
    'monexo': 11,
    'jiffy': 12,
    'flipit_news': 13,
    'rigi_club': 14,
    'kotak_securities': 15,
    'kotak_bank': 16,
    'finovate_prod_account': 17,
    'wobb_prod': 18,
    'drink_prime_prod': 19,
    'my_medi_sage': 20,
    'woovly': 21,
    'sarvm': 22
  }

function getObjKey(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

function set_item_vals(obj, i, listval) {
    obj[`line_item_tiers[line_item_id][${i}]`]=listval[0]
    obj[`line_item_tiers[starting_unit][${i}]`]=listval[1]
    obj[`line_item_tiers[ending_unit][${i}]`]=listval[2], 
    obj[`line_item_tiers[quantity_used][${i}]`]=listval[3], 
    obj[`line_item_tiers[unit_amount][${i}]`]=listval[4]
}

const objectToCsv = function (data) {

    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    // Loop to get value of each objects key
    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header]
            return `"${val}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

fs.readFile((process.env.FILE || "user")+'.json', 'utf-8', async (err, data) => {
    sls = await JSON.parse(data.toString());
    
    sls.forEach(row => {
        csv_obj = {}
        i = 0, j = 0;
        prev = null;
        let col = [];

        csv_obj["name"] = row.name;
        const itmq = row.items_with_mq;
        // console.log(row);

        for (let idx = 0; idx < row.item_tiers.length; idx++) {
            const tier = row.item_tiers[idx];
            // console.log(plans, tier.item_price_id, plans.includes(tier.item_price_id));
            if (plans.includes(tier.item_price_id)) {
                // console.log(tier.item_price_id);
                
                listval = [line_item_id[j], tier.starting_unit, tier.ending_unit?? "", itmq[tier.item_price_id], tier.price];
            } else if(i == 0) {
                let plan = getObjKey(itmq, 0);
                // console.log(plan);
                // console.log({tier});
                idx = -1;
                if(!plan) {
                    console.log({itmq}, {row});
                }
                listval = [line_item_id[j], "", "", "", ""];                
            } else {
                j = prev != tier.item_price_id? j + 1: j; 
                prev = prev != tier.item_price_id? tier.item_price_id : prev;

                listval = [line_item_id[j], tier.starting_unit, tier.ending_unit?? "", itmq[tier.item_price_id], tier.price];
            }
            set_item_vals(csv_obj, i, listval);
            if(i > max_row) max_row = i
            i += 1;
            // console.log({tier});
            // if (i == 71) console.log(row.name);
        }  
        for (let idx = i; idx <= 70; idx++) {
            set_item_vals(csv_obj, idx, ["","","","",""])            
        }
        // console.log(row.item_tiers.length);
        main_arr.push(csv_obj)      
    });
    // console.log({main_arr});
    main_arr.sort((a,b) => (thisObj[a.name] > thisObj[b.name] ? 1 : -1))
    main_arr.forEach(obj => console.log(obj.name))
    var dataToWrite = objectToCsv(main_arr)
    fs.writeFile('resultant.csv', dataToWrite, 'utf8', function (err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
          console.log('It\'s saved!');
        }
      });
      var newData = objectToCsv(main_arr.slice(3))
      fs.writeFile('sample.csv', newData, 'utf8', function (err) {
          if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
          } else{
            console.log('It\'s saved!');
          }
        });
      
    // console.log({main_arr});
    // main_arr.forEach(item => console.log(item.name, '--->', Object.keys(item).length, `\t\ti: ${i},\t i x 5 = ${i * 5}`))
    console.log({max_row});
})

// #[line_item_id][0]	#[starting_unit][0]	#[ending_unit][0]	#[quantity_used][0]	#[unit_amount][0]	
// 1001                 1                   25                  25                  100
// #[line_item_id][1]	#[starting_unit][1]	#[ending_unit][1]	#[quantity_used][1]	#[unit_amount][1]	
// 1001	                26	                50                  15                  200
// #[line_item_id][2]	#[starting_unit][2]	#[ending_unit][2]	#[quantity_used][2]	#[unit_amount][2]	
// 1005                 1                   25                  25                  100
// #[line_item_id][3]	#[starting_unit][3]	#[ending_unit][3]	#[quantity_used][3]	#[unit_amount][3]
// 1005                 26                  50                  15                  200

// line_item_tiers
