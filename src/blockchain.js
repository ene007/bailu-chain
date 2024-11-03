// 迷你区块链：
// 区块链的生成、新增、校验
// 交易
// 非对称交易
// 挖矿
// p2p网络

// [
//     // 创世区块
//     {
//         index: 0, //索引 
//         timestamp: 1539096000, //时间戳
//         data: "Genesis Block", //区块的具体信息 主要是交易信息
//         hash: "xxx", //当前区块的哈希值
//         prevHash: "0", //上一个区块的哈希值
//         nonce: 0 //随机数
//     },
//     {
//         index: 1, //索引 
//         timestamp: 1539096000, //时间戳
//         data: "Genesis Block", //区块的具体信息 主要是交易信息
//         hash: "yyyy", //当前区块的哈希值
//         prevHash: "xxx", //上一个区块的哈希值
//         nonce: 0 //随机数
//     }
// ]

const crypto = require('crypto')
const { stringify } = require('querystring')

// 创世区块
const initBlock = {
    index: 0,
    data: 'Hello Bailu!',
    prevHash: '0',
    timestamp: 1730607283606,
    nonce: 14,
    hash: '009c958e74603f268f2b3afbaf33fe4d32a4919e74b67a711628884d1c04263d'
  }

class Blockchain{
    constructor(){
        this.blockchain = [
            initBlock
        ],
        this.data = []
        this.difficulty = 3
    }

    // 获取最后一个区块
    getLastBlock(){
        return this.blockchain[this.blockchain.length - 1]
    }

    transfer(from, to, amount){
        // 签名校验（后面完成）
        const trasnObj = {from, to, amount}
        this.data.push(trasnObj)
        return trasnObj;
    }

    // 挖矿
    mine(){
        // 1. 生成新区快 一页新的账本
        // 2. 计算哈希，不停计算 知道符合难度条件
       const newBlock = this.generateNewBlock();
       if(this.isValidBlock(newBlock) && this.isValidChain()){
           this.blockchain.push(newBlock);
           return newBlock;
       }else{
           console.log('区块无效')
       }

        // 3. 校验区块
    }

    // 新增区块
    generateNewBlock(){
        let nonce = 0;
        const index = this.blockchain.length;
        const data = this.data;
        const prevHash = this.getLastBlock().hash;
        let timestamp = new Date().getTime();
        let hash = this.computeHash(index, prevHash, timestamp, data, nonce);
        while(hash.slice(0,this.difficulty) !== '0'.repeat(this.difficulty)){
            nonce += 1;
            hash = this.computeHash(index, prevHash, timestamp, data, nonce);
        }
        return{
            index,
            data,
            prevHash,
            timestamp,
            nonce,
            hash
        }
    }

    // 计算哈希
    computeHash(index, prevHash, timestamp, data,  nonce){
        return crypto.createHash('sha256')
        .update(index + timestamp + data + prevHash + nonce)
        .digest('hex')
    }

    // 计算哈希
    computeHashForBlock({index, prevHash, timestamp, data,  nonce}){
        return this.computeHash(index, prevHash, timestamp, data,  nonce)
    }

    // 校验区块
    isValidBlock(newBlock, lastBlock=this.getLastBlock()){
        // 校验区块哈希值是否符合规则
        // 1. 区块索引是否正确
        // 2. 上一个区块哈希值是否正确
        // 3. 时间戳是否正确
        // 4. 区块的hash 符合难度要求
       
        if(newBlock.index !== lastBlock.index + 1){
            console.log("index err");
            return false;
        }else if(newBlock.timestamp <= lastBlock.timestamp){
            console.log(newBlock.index, ":", lastBlock.index)
            console.log("timestamp err");
            return false;
        }else if(newBlock.prevHash !== lastBlock.hash){
            console.log("prevHash err");
            return false;
        }else if(newBlock.hash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)){
            console.log("difficulty err");
            return false;
        }else if(newBlock.hash !== this.computeHashForBlock(newBlock)){
            console.log("hash err");

            return false;
        }
        return true;


    }

    // 校验区块链
    isValidChain(chain=this.blockchain){
        for(let i = chain.length-1; i>=1; i--){
            if(!this.isValidBlock(chain[i], chain[i-1])){
                return false;
            }
        }
        if(JSON.stringify(chain[0]) !== JSON.stringify(initBlock)){
            return false;
        }
        return true;
    }



}

// let bc = new Blockchain()
// bc.mine()
// bc.blockchain[1].nonce = 123
// bc.mine()
// bc.mine()
// bc.mine()
// console.log(bc.blockchain)
module.exports = Blockchain