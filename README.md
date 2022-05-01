# esplora-api-process-script
Script in JS to pull data from an Esplora API Server, process and output it in HTML.

This script can be used to 
- pull the blockchain height, hash of the latest block, transactions in the latest block, transactions and fee currently in the mempool 
- calculate the transactions per second, fee in mempool in bits
- output the values in specified HTML divisions

You may also customize the update frequency and API Server to call.
If you want to pull other data you can use the existing methods as templates.
See the documentation of esplora for more information: 
https://github.com/Blockstream/esplora/blob/master/API.md
