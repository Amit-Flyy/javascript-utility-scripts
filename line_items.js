// line_items[id][1]	line_items[entity_type][1]	line_items[entity_id][1]	line_items[description][1]	line_items[date_from][1]	line_items[date_to][1]	line_items[quantity][1]	line_items[amount][1]
var fs = require('fs');
var main_arr = [], csv_obj = {}, sls, listval = [], prev, max_row = 0, i;

var plans = ['Avail-Finance-ARE', 'Enterprise-Plan-For-Existing', 'Enterprise-With-Former-Pricing', 'Kotak-retention-plan-MPU-based', 'Moms-Presso-MyMoCard-INR-Monthly']


function getObjKey(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

function set_item_vals(obj, i, listval, def = true) {
    obj[`line_items[id][${i}]`]=listval[0]
    obj[`line_items[entity_type][${i}]`]= listval[1]
    obj[`line_items[entity_id][${i}]`]=listval[2], 
    obj[`line_items[description][${i}]`]=listval[3], 
    obj[`line_items[date_from][${i}]`] = listval[4];
    obj[`line_items[date_to][${i}]`] = listval[5];
    obj[`line_items[quantity][${i}]`]=listval[6],
    obj[`line_items[amount][${i}]`]=listval[7]
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

fs.readFile((process.env.FILE || "file")+'.json', 'utf-8', async (err, data) => {
    sls = await JSON.parse(data.toString());
    // console.log(sls);
    sls.forEach(row => {
        csv_obj = {}
        i = 0, j = 0;
        prev = null;
        let col = [];
        let line_item_id = [1005, 1006, 1007, 1008, 1009, 1010];
        csv_obj["name"] = row.name;
        // console.log(row.details.subscription_addons);

        for (let idx = 0; idx < row.details.subscription_addons.length; idx++) {
            // break
            const item = row.details.subscription_addons[idx];
            if (item.item_type == 'plan') {
                continue;
            } else {                
                if(!parseInt(item.metered_quantity)) console.log(item);
                listval = [line_item_id[i], "addon", item.item_price_id, "HSN CODE: 997331", `EDATE(F${i+2}, -1)`, `EOMONTH(CG${i+2}, 0)`,parseInt(item.metered_quantity), item.price];
            }
            set_item_vals(csv_obj, i + 1, listval);
            if((i + 1) > max_row) max_row = (i + 1)
            i += 1;
        }  
        for (let idx = i + 1; idx <= 4; idx++) {
            set_item_vals(csv_obj, idx, ["","","","","","","", ""])            
        }
        console.log(Object.keys(csv_obj).length);
        main_arr.push(csv_obj)      
    });
    // console.log({main_arr, max_row});
    var dataToWrite = objectToCsv(main_arr)
    fs.writeFile('line_items.csv', dataToWrite, 'utf8', function (err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
          console.log('It\'s saved!');
        }
      });

    // console.log({main_arr});
    // main_arr.forEach(item => console.log(item.name, '--->', Object.keys(item).length, `\t\ti: ${i},\t i x 5 = ${i * 5}`))
    // console.log({max_row});
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