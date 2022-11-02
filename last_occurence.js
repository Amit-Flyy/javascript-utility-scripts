// var str = 'abc def abc xyz';
// var word = 'abc';
// var newWord = 'test';

// var n = str.lastIndexOf(word);
// n != -1? str = str.slice(0, n) + str.slice(n + word.length, str.length): null;
// console.log(str, n)

function get_add_values (){
    var str = `Fintech Blue Solutions Pvt Ltd1st floor, 101, Prime Corporate Park, Near Blue Dart office, Bhh ITC
    Maratha Hotel Sahar Road, Andheri East Mumbai, Mumbai City, Maharashtra, 400099`


    let cities = ["Kota" , "Mumbai", "Gurugram", "Chennai", "Bangalore", "Bengaluru", "Pune", "Hyderabad", "Indore", "Gurgaon", "Delhi", "Powai"]

    var states = ['AP' , 'Andhra Pradesh', 'AR' , 'Arunachal Pradesh', 'AS' , 'Assam', 'BR' , 'Bihar', 'CT' , 'Chhattisgarh', 'GA' , 'Goa', 'GJ' , 'Gujarat', 'HR' , 'Haryana', 'HP' , 'Himachal Pradesh', 'JK' , 'Jammu and Kashmir', 'JH' , 'Jharkhand', 'KA' , 'Karnataka', 'KL' , 'Kerala', 'MP' , 'Madhya Pradesh', 'MH' , 'Maharashtra', 'MN' , 'Manipur', 'ML' , 'Meghalaya', 'MZ' , 'Mizoram', 'NL' , 'Nagaland', 'OR' , 'Odisha', 'PB' , 'Punjab', 'RJ' , 'Rajasthan', 'SK' , 'Sikkim', 'TN' , 'Tamil Nadu', 'TG' , 'Telangana', 'TR' , 'Tripura', 'UT' , 'Uttarakhand', 'UP' , 'Uttar Pradesh', 'WB' , 'West Bengal', 'AN' , 'Andaman and Nicobar Islands', 'CH' , 'Chandigarh', 'DN' , 'Dadra and Nagar Haveli', 'DD' , 'Daman and Diu', 'DL' , 'Delhi', 'LD' , 'Lakshadweep', 'PY' , 'Puducherry']


    var code_to_state = {'AP' :  'Andhra Pradesh', 'AR' :  'Arunachal Pradesh', 'AS' :  'Assam', 'BR' :  'Bihar', 'CT' :  'Chhattisgarh', 'GA' :  'Goa', 'GJ' :  'Gujarat', 'HR' :  'Haryana', 'HP' :  'Himachal Pradesh', 'JK' :  'Jammu and Kashmir', 'JH' :  'Jharkhand', 'KA' :  'Karnataka', 'KL' :  'Kerala', 'MP' :  'Madhya Pradesh', 'MH' :  'Maharashtra', 'MN' :  'Manipur', 'ML' :  'Meghalaya', 'MZ' :  'Mizoram', 'NL' :  'Nagaland', 'OR' :  'Odisha', 'PB' :  'Punjab', 'RJ' :  'Rajasthan', 'SK' :  'Sikkim', 'TN' :  'Tamil Nadu', 'TG' :  'Telangana', 'TR' :  'Tripura', 'UT' :  'Uttarakhand', 'UP' :  'Uttar Pradesh', 'WB' :  'West Bengal', 'AN' :  'Andaman and Nicobar Islands', 'CH' :  'Chandigarh', 'DN' :  'Dadra and Nagar Haveli', 'DD' :  'Daman and Diu', 'DL' :  'Delhi', 'LD' :  'Lakshadweep', 'PY' :  'Puducherry'} 

    var city_to_state = {"Kota" : "RJ" , "Mumbai" : "MH", "Gurugram" : "HR", "Chennai" : "TN", "Bangalore" : "KA", "Bengaluru" : "KA", "Pune": "MH", "Hyderabad" : 'TG', "Indore" : "MP", "Gurgaon" : "HR", "Delhi" : "Delhi", "Powai" : "MH"}


    var state_to_code = Object.entries(code_to_state).map(([key, value]) => [value, key])
    state_to_code = Object.fromEntries(state_to_code)
    // console.log({state_to_code});

    const pin_regex = /\d{5}\w/g;

    let info = {}, state, city, pin;

    let var_len = 25;

    if (str.includes('HTH Technolabs')) {
    var_len = 40
    }

    if (states.some(function(v) { return (str.lastIndexOf(v) != -1) && (str.lastIndexOf(v) > str.length - var_len); })) {
    // There's at least one
    state = states.filter(v => (str.lastIndexOf(v) != -1) && (str.lastIndexOf(v) > str.length - var_len))[0];
    var n = str.lastIndexOf(state);
    str = str.slice(0, n) + str.slice(n + state.length, str.length);

    if (state.length == 2) {
        info.state_code = state;
        info.state = code_to_state[state];
    } else {
        info.state = state;
        info.state_code = state_to_code[state];
    }    
    } else {
    state = null;
    console.error("Not found for state for: ", str)
    }


    if (cities.some(function(v) { return (str.lastIndexOf(v) != -1) && (str.lastIndexOf(v) > (str.length - var_len - 15)); })) {
    // There's at least one
    city = cities.filter(v => (str.lastIndexOf(v) != -1) && (str.lastIndexOf(v) > (str.length - var_len - 15)))[0];
    info.city = city;

    var n = str.lastIndexOf(city);
    str = str.slice(0, n) + str.slice(n + city.length, str.length)

    } else {
    city = null;
    console.error("Not found for city: ", str)
    }

    pin = str.match(pin_regex)[0]
    // console.log({pin});
    if (pin && pin.length == 6) {
    info.pin = pin;
    str = str.replace(pin, "");
    } else {
    pin = null;
    console.error("Not found for pin: ", str)
    }

    str = str.replace(/,+/g, ',')

    if (info.state_code != city_to_state[city]) {
    if (info.city == "Delhi") {
    info.state = "Delhi"
    info.state_code = "DL"
    }
    if (city && !state) {
        state =  city_to_state[city];
        info.state_code = state;
        info.state = code_to_state[state]
    } else {
        console.error("Incorrect state! ", city, state, {str});
    }
    }

    // console.log({info, str});

    let words, ad_line_1 = '', ad_line_2 = '', ad_line_3 = '';
    words = str.split(' ');


    if (words.length > 20) {
    ad_line_1 = words.slice(0, 5).join(' ')
    ad_line_2 = words.slice(5, 12).join(' ')
    ad_line_3 = words.slice(12, words.length).join(' ')
    } else {
    ad_line_1 = words.slice(0, 4).join(' ')
    ad_line_2 = words.slice(4, 10).join(' ')
    ad_line_3 = words.slice(12, words.length).join(' ')    
    }
    if (ad_line_3.length <= 10) {
    ad_line_2 = ad_line_2 + ad_line_3
    ad_line_3 = ''
    }
    // console.log({str, ad_line_1, ad_line_2, ad_line_3 ,});
    info = {...info, ad_line_1, ad_line_2, ad_line_3 }



    // const arr = Array(24).fill(1).map(ele => Array(9).fill(100))


    // 0: company_name,	1:pin	, 2:city	3:state, 4:state_code, 5:ad_line_1, 6: ad_line_2	7:ad_line_3	8:str
    var arr = [info.pin, info.city, info.state, info.state_code, info.ad_line_1, info.ad_line_2, info.ad_line_3]

    console.log({arr});

    }


GST Number

