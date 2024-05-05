let message = '+2723 hsjhdklah'

let index = null;
for(let i = 1; i < message.length; i++){
    if(!(/\d/.test(message.at(i)))){
        if(!(message.at(i) === '.')){
            index = i;
            break;
        }
    }
}
const amt = parseFloat(message.substring(1, index));
console.log(amt);