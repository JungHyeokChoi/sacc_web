const router = require('express').Router()
const {FileSystemWallet, Gateway} = require('fabric-network')
const fs = require('fs')
const path = require('path')

const ccpPath = path.resolve(__dirname, '..', 'connection.json')
const ccpJSON = fs.readFileSync(ccpPath, 'utf-8')
const ccp = JSON.parse(ccpJSON)

router.route('/')
    .get((req, res) => {
        res.render('index')
    })

router.route('/create')
    .get((req, res) => {
        res.render('create')
    })
    .post(async (req, res) => {
        const key = req.body.key
        const value = req.body.value
        
        const walletPath = path.join(process.cwd(), 'wallet')
        const wallet = new FileSystemWallet(walletPath)
        console.log(`Wallet path : ${walletPath}`)

        const userExists = await wallet.exists('user1')
        if(!userExists){
            console.log ('An identity for the user "user1" does not exist in the wallet')
            console.log ('Run the registerUser.js application before retrying')
            return
        }
        const gateway = new Gateway()
        await gateway.connect(ccp, {wallet, identity:'user1', discovery:{enabled:false}})

        const network = await gateway.getNetwork('mychannel')
        const contract = network.getContract('sacc')
        await contract.submitTransaction('set', key, value)

        console.log('Transaction has been submitted')
        await gateway.disconnect()

        await res.render('index')
    })

router.route('/key')
    .post(async (req, res) => {
        const key = req.body.key
        
        const walletPath = path.join(process.cwd(), 'wallet')
        const wallet = new FileSystemWallet(walletPath)
        console.log(`Wallet path : ${walletPath}`)

        const userExists = await wallet.exists('user1')
        if(!userExists){
            console.log ('An identity for the user "user1" does not exist in the wallet')
            console.log ('Run the registerUser.js application before retrying')
            return
        }
        const gateway = new Gateway()
        await gateway.connect(ccp, {wallet, identity:'user1', discovery:{enabled:false}})

        const network = await gateway.getNetwork('mychannel')
        const contract = network.getContract('sacc')
        const result = await contract.evaluateTransaction('get', key)

        console.log(`Transaction has been evaluated, reulst is :${result.toString()}`)

        await res.render('index')
    })

router.route('/modify')
    .get((req, res) => {
        res.render('modify')
    })

router.route('/query')
    .get((req, res) => {
        res.render('query')
    })

module.exports = router