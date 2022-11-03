var fs = require('fs');
var pricing_tiers = [];
var line_items = []
CHARGEBEE_API_KEY="live_F2Ahqr8TjzuDTibBhnlHciCMGdl84IXz"
CHARGEBEESITE="theflyy"
var chargebee = require("chargebee");

chargebee.configure({ site: CHARGEBEESITE, api_key: CHARGEBEE_API_KEY });

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

var inv_count = {
  'medcords' :	23,  'mintpro' :	23,  'momspresso' :	21,  'taxbuddy' :	31,  'stucred' :	20,  
  'hirehunch' :	15,  'oto' :	13,  'cashe' :	12,  'avail' :	12,  'pharmarack' :	14,  'mypaisaa' :	11,  
  'monexo' :	10,  'jiffy' :	9,  'flipit_news' :	8,  'rigi_club' :	7,  'kotak_securities' :	8,  
  'kotak_bank' :	6,  'finovate_prod_account' :	5,  'wobb_prod' :	4,  'drink_prime_prod' :	3,  
  'my_medi_sage' :	3,  'woovly' :	1,  'sarvm' :	1,
}

async function get_subscription_data(req, customerID, ) {
    return new Promise(async (resolve, reject) => {
      {
        var new_row = {}, line_item_row = {};
        new_row.name = customerID;
        line_item_row.name = customerID;
        // console.log({customerPayTerms});
        chargebee.subscription
          .list({
            limit: 1,
            // "customer_id[is]" : "169ls6T6k0XDhT7I", // is or is_not for filtering
            "customer_id[is]": customerID,
            "sort_by[desc]": "created_at",
          })
          .request(function (error, result) {
            if (error || result.list.length === 0) {
              error? console.error(error): console.log("No subscrtipions present.");
              let message = error ? "Error retrieveing customer data" : "You have no subscription"
              // res.send({success: false, message: error});
              // console.log(result.list);
              subscription_details = {};
              reject({subscription_details});
              // res.send({success: false, message: "subscription data couldn't be fetched", subscription_details});
            } else {
              // console.log("If customer present: ", customerID);
              let subscription = result.list[0].subscription;
              // console.log({subscription});
              var price = subscription.subscription_items[0].amount ? subscription.subscription_items[0].amount: 0;
              // console.log({subscription_items: subscription.subscription_items});
  
              let metered_quantity = 0, addons_item_tier = subscription.item_tiers, plan_item_tier, plan_is_metered = false;
              var sub_addons = subscription.subscription_items.filter(item => item.item_type == "addon");
              var level = null, price_level_obj;
              for (let index = 0; index < subscription.subscription_items.length; index++) {
                var sub_item = subscription.subscription_items[index];
                if (sub_item.item_type == 'charge'){
                  price += sub_item.amount;
                }
              }

              var item_to_mq = {};
              subscription.subscription_items.forEach((items) => {
                // console.log({items});
                if(items.metered_quantity) {
                  item_to_mq[items.item_price_id] = parseInt(items.metered_quantity)
                } else {
                  item_to_mq[items.item_price_id] = 0
                }
               
              });
            //   console.log({ sub_det: subscription.item_tiers });
              // console.log({item_to_mq});
              new_row['items_with_mq'] = item_to_mq
              new_row.item_tiers = subscription.item_tiers;
              // line_item_row.details = {}
              for (let idx = 0; idx < subscription.subscription_items.length; idx++) {
                const item = subscription.subscription_items[idx];
                item.price = item.metered_quantity ? stairstep_price_calculation([item], item.metered_quantity, subscription.item_tiers) : 0;
                // console.log(item);
              }
              line_item_row.details= {"subscription_addons" : subscription.subscription_items};
              new_row.details = {"subscription_items" : subscription.subscription_items};
              // new_row.items = subscription.subscription_items
              // console.log(new_row);
              for (let inv_num = 0; inv_num < inv_count[customerID]; inv_num++) {
                pricing_tiers.push(new_row)
                // console.log(pricing_tiers.length);
              }
              line_items.push(line_item_row)

              resolve({});
            }
          });
      }
    });
}

function stairstep_price_calculation(sub_items, metered_quantity, sub_item_tiers) {
// let metered_quantity, price, level, addon.price, 
let price = 0, level = 0;
// console.log({sub_items, metered_quantity, sub_item_tiers});
if (sub_items.length != 0 && sub_item_tiers){
    let sub_item_tier = sub_item_tiers;
    let tier_length = sub_item_tier.length, traversed_list; 
    traversed_list = 0;

    for (let index = 0; index < sub_items.length; index++) {
    var item_sub = sub_items[index];
    if(!item_sub.metered_quantity){
        // console.log(item_sub);
        price += item_sub.amount;
        continue;
    }
    if(!level) {
        // console.log("logging indexes", index);
        for (let item_tier = traversed_list; item_tier < tier_length; item_tier++) {
        let tier = sub_item_tier[item_tier];

        // console.log(tier.item_price_id, item_sub.item_price_id, tier.item_price_id == item_sub.item_price_id);
        // console.log(tier.item_price_id == item_sub.item_price_id, 
        //   parseInt(tier.starting_unit) <= metered_quantity, 
        //   (!tier.ending_unit || parseInt(tier.ending_unit) >= metered_quantity));

        if(tier.item_price_id == item_sub.item_price_id && 
            parseInt(tier.starting_unit) <= metered_quantity && 
            (!tier.ending_unit || parseInt(tier.ending_unit) >= metered_quantity)){

            if(!level){
                level = (item_tier)%(parseInt(tier_length / (sub_items.length))) + 1; //check here
            }
            item_sub.price = tier.price;
            price += item_sub.price;
            return item_sub.price;
            // console.log("Main hu Addon: ", addon);

            // console.log("15451", {index, item_tier, level, metered_quantity});
            traversed_list = item_tier + 1;
            break;
        }
        }
    } else {
        let predicted_index = index * parseInt(tier_length / (sub_items.length)) + level - 1;
        // predicted_index = predicted_index < sub_item_tier.length ? predicted_index : 0;
        const tier = sub_item_tier[predicted_index];
        // console.log("log tier", tier, predicted_index, level);
        // console.log(predicted_index);
        if(tier && 
        tier.item_price_id == item_sub.item_price_id && 
        parseInt(tier.starting_unit) <= metered_quantity && 
        (!tier.ending_unit || parseInt(tier.ending_unit) >= metered_quantity)){
            
            item_sub.price = tier.price;
            price += item_sub.price;
            // console.log("15467", {index, item_tier: predicted_index, level, metered_quantity});
            traversed_list = predicted_index;
            // console.log("Main hu Addon: ",item_sub);
            
        } else {
        level = null;
        index -= 1;
        // console.log("15476", {tier, index, predicted_index});
        continue;
        }
    }

    }
}
// console.log({sub_items, price, level, metered_quantity} );
return price;

}
  

var custids = ['medcords', 'mintpro', 'momspresso', 'taxbuddy', 'stucred', 'hirehunch', 'oto', 'cashe', 'avail', 'pharmarack', 'mypaisaa', 'monexo', 'jiffy', 'flipit_news', 'rigi_club', 'kotak_securities', 'kotak_bank', 'finovate_prod_account', 'wobb_prod', 'drink_prime_prod', 'my_medi_sage', 'woovly', 'sarvm']

var d = 0;
for (let customer = 0; customer < custids.length; customer++) {
    const cust = custids[customer];
    get_subscription_data("", cust)
        .then(res => {
            d += 1;
            // console.log(d);
            if (d == 23) {
                
                // console.log(pricing_tiers);
                pricing_tiers.sort((a,b) => (thisObj[a.name] > thisObj[b.name] ? 1 : -1))
                pricing_tiers.forEach(obj => console.log(obj.name))
                var data = JSON.stringify(pricing_tiers)
                // write JSON string to a file
                fs.writeFile('users.JSON', data, err => {
                  if (err) {
                      throw err
                  }
                  console.log(data);
                  console.log('JSON data is saved.')
                })
                var line_item_data = JSON.stringify(line_items)
                fs.writeFile('file.JSON', line_item_data, err => {
                  if (err) {
                      throw err
                  }
                  console.log('JSON data is saved.')
                })
            }
        })
        .catch(res => {
            console.log(res);
            d += 1;
            console.log(cust, d, "ERORRORO");
            
        })          
}
