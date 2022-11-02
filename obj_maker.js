var i = 0;
function getIndexVal(j) {
    i += 1
    return j;
}

var thisObj = {
    'medcords' : getIndexVal(i),
    'mintpro' : getIndexVal(i),
    'momspresso' : getIndexVal(i),
    'taxbuddy' : getIndexVal(i),
    'stucred' : getIndexVal(i),
    'hirehunch' : getIndexVal(i),
    'oto' : getIndexVal(i),
    'cashe' : getIndexVal(i),
    'avail' : getIndexVal(i),
    'pharmarack' : getIndexVal(i),
    'mypaisaa' : getIndexVal(i),
    'monexo' : getIndexVal(i),
    'jiffy' : getIndexVal(i),
    'flipit_news' : getIndexVal(i),
    'rigi_club' : getIndexVal(i),
    'kotak_securities' : getIndexVal(i),
    'kotak_bank' : getIndexVal(i),
    'finovate_prod_account' : getIndexVal(i),
    'wobb_prod' : getIndexVal(i),
    'drink_prime_prod' : getIndexVal(i),
    'my_medi_sage' : getIndexVal(i),
    'woovly' : getIndexVal(i),
    'sarvm' : getIndexVal(i),
    }
// console.log(thisObj);
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

var arr = shuffle(Object.keys(thisObj))


arr.sort((a,b) => (thisObj[a] > thisObj[b] ? 1 : -1))
console.log(arr);