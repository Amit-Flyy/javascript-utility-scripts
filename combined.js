var fs = require('fs');
const { get } = require('http');
var main_arr = [], csv_obj = {}, sls, listval = [], prev, max_row = 0, i, line_item_id = 1001, qu;
var company_item_id = {}
var plans = ['Avail-Finance-ARE', 'Kotak-retention-plan-MPU-based', 'Moms-Presso-MyMoCard-INR-Monthly']
// var plans = ['Avail-Finance-ARE', 'Enterprise-Plan-For-Existing', 'Enterprise-With-Former-Pricing', 'Kotak-retention-plan-MPU-based', 'Moms-Presso-MyMoCard-INR-Monthly']
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

function set_line_item_vals(obj, i, listval, def = true) {
    obj[`line_items[id][${i}]`]=listval[0]
    obj[`line_items[entity_type][${i}]`]= listval[1]
    obj[`line_items[entity_id][${i}]`]=listval[2], 
    obj[`line_items[description][${i}]`]=listval[3], 
    obj[`line_items[date_from][${i}]`] = '';
    obj[`line_items[date_to][${i}]`] = listval[5];
    obj[`line_items[quantity][${i}]`]=listval[6],
    obj[`line_items[unit_amount][${i}]`]="",
    obj[`line_items[amount][${i}]`]=listval[7]
}

function set_item_vals(obj, i, listval) {
    // if(!listval[0] && listval[0] !== '') console.log(obj, listval);
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

fs.readFile((process.env.FILE || "users")+'.JSON', 'utf-8', async (err, data) => {
    sls = await JSON.parse(data.toString());
    // console.log(sls);
    sls.forEach(row => {
        csv_obj = {}
        i = 0, j = 0;
        prev = null;
        csv_obj["name"] = row.name;
        const itmq = row.items_with_mq;
        // console.log(row);

        for (let idx = 0; idx < row.details.subscription_items.length; idx++) {
            // break
            const item = row.details.subscription_items[idx];
            company_item_id[row.name + item.item_price_id] = line_item_id
            if (item.item_type == 'plan') {
                qu = item.metered_quantity ? parseInt(item.metered_quantity) : " "
                // console.log(qu);
                if (!item.unit_price && item.unit_price !== 0) console.log('broken -->', row.name, row.details, qu);
                listval = [line_item_id, "plan", item.item_price_id, "HSN CODE: 997331", "", "", qu, item.unit_price];
                line_item_id += 1;
            } else {                
                if(!parseInt(item.metered_quantity)) console.log(item);
                // console.log();
                listval = [line_item_id, "addon", item.item_price_id, "HSN CODE: 997331", "", "", parseInt(item.metered_quantity), item.unit_price];
                line_item_id += 1;
            }
            set_line_item_vals(csv_obj, i, listval);
            
            if((i + 1) > max_row) max_row = (i + 1)
            i += 1;
        }
        
        for (let idx = i; idx <= 4; idx++) {
            set_line_item_vals(csv_obj, idx, ["","","","","","","", ""])            
        }
        // console.log(company_item_id);
        i = 0, j = 0;
        for (let idx = 0; idx < row.item_tiers.length; idx++) {
            const tier = row.item_tiers[idx];
            // console.log(plans, tier.item_price_id, plans.includes(tier.item_price_id));
            if (plans.includes(tier.item_price_id)) {
                // console.log(tier.item_price_id);
                
                listval = [company_item_id[row.name + tier.item_price_id], tier.starting_unit, tier.ending_unit?? "", itmq[tier.item_price_id], tier.price];
            } else if(i == -2321) {
                let plan = getObjKey(itmq, 0);
                // console.log(plan);
                // console.log({tier});
                idx = -1;
                if(!plan) {
                    console.log({itmq}, {row});
                }
                listval = [company_item_id[row.name + tier.item_price_id], "", "", "", ""];                
            } else {
                j = prev != tier.item_price_id? j + 1: j; 
                prev = prev != tier.item_price_id? tier.item_price_id : prev;

                listval = [company_item_id[row.name + tier.item_price_id], tier.starting_unit, tier.ending_unit?? "", itmq[tier.item_price_id], tier.price];
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
    main_arr.sort((a,b) => (thisObj[a.name] != thisObj[b.name]) ? (thisObj[a.name] > thisObj[b.name] ? 1 : -1) : (a['line_items[id][0]'] > b['line_items[id][0]']? 1 : -1))
    var date_idx = 2
    for (let inv_n = 0; inv_n < main_arr.length; inv_n++) {
        const inv = main_arr[inv_n];
        var ob_keys = Object.keys(inv);
        for (let idx = 0; idx < ob_keys.length; idx++) {
            const ob_key = ob_keys[idx];
            if (ob_key.includes('date')) {
                if (ob_key.includes('date_from')) {
                    inv[ob_key] = `=IF(ISBLANK(INDIRECT(ADDRESS(ROW(),COLUMN()-1))), , IF(DAYS(EOMONTH(F${date_idx}, 0), F${date_idx}) > 15, EOMONTH(F${date_idx}, -2) + 1, EOMONTH(F${date_idx}, 0) + 1))`
                } else if (ob_key.includes('date_to')) {
                    inv[ob_key] = "=IF(ISBLANK(INDIRECT(ADDRESS(ROW(),COLUMN()-2))), '', EOMONTH(INDIRECT(ADDRESS(ROW(),COLUMN()-1)), 0))"
                }
            }
        }
        date_idx += 1
    }
    main_arr.forEach(obj => console.log(obj.name))
    var dataToWrite = objectToCsv(main_arr)
    fs.writeFile('new_test.csv', dataToWrite, 'utf8', function (err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
          console.log('It\'s saved!');
        }
      });
    //   var newData = objectToCsv(main_arr.slice(3))
    //   fs.writeFile('sample.csv', newData, 'utf8', function (err) {
    //       if (err) {
    //         console.log('Some error occured - file either not saved or corrupted file saved.');
    //       } else{
    //         console.log('It\'s saved!');
    //       }
    //     });
      
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
