const vorpal = require('vorpal')();
const Blockchain = require('./blockchain');
const Table = require('cli-table3');

const blockchain = new Blockchain();

function formatLog(data){
    if(!Array.isArray(data)){
        data = [data]
    }
    const first = data[0]
    const head = Object.keys(first)
    const table = new Table({
        head: head,
    })
    const res = data.map(item=>{
        return head.map(key=>item[key])
    })
    table.push(...res)
    console.log(table.toString());

}

vorpal.command('trans <from> <to> <amount>', '转账').action(function(args, callback) {
    let trans = blockchain.transfer(args.from, args.to, args.amount)
    formatLog(trans)
    callback();
})


vorpal.command('mine', '挖矿').action(function(args, callback) {
    const newBlock = blockchain.mine()
    if(newBlock){
        formatLog(newBlock)
    }
    callback();
})

vorpal.command('chain', '查看区块链').action(function(args, callback) {
    formatLog(blockchain.blockchain)
    callback();
})

// vorpal.command('hello', 'Say hello to the world.').action(function(args, callback) {
//     this.log("hello blockchain")
//     this.log(args)
//     callback();
// })

console.log("welcome to Bailu-chain")

vorpal.exec('help')

vorpal
    .delimiter("Bailu-chain$")
    .show();