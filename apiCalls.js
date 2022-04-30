//You may customize these values before deploying the script, to make them suit your needs.

//API Endpoint. Standard endpoint is the Blockstream API.
const apiEndpoint = 'https://blockstream.info/api/';

//How often should the API calls be made and updated in milliseconds. Standard is every minute.
const updateInterval = 60000;

const adrBlockheight = apiEndpoint+'blocks/tip/height';
const adrMempool = apiEndpoint+'mempool';
const adrTipHash = apiEndpoint+'blocks/tip/hash';
const adrBlock = apiEndpoint+'block/';
const errorMsg = "Error reaching API..";

//Output divisions in the HTML file selected by ID.
//These divisions will be completely overwritten, so you must create a division each only for the Output.
const divBlockheight = document.getElementById('changeblch');
const divTPS = document.getElementById('changetps');
const divMempoolCount = document.getElementById('changemempoolcount');
const divMempoolFees = document.getElementById('changemempoolfee');

//Helper functions
function sleep(milliseconds) {
 return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function changeText(id, text){
  var p = document.getElementById(id);
  p.innerHTML = text;
}

//Call the blockheight from the specified API and return as String.
async function getBlockheight(){
  let response = await fetch(adrBlockheight);
  if(response.ok){
    return await response.text();
  }
  else return errorMsg;
}

//Call the number of transactions in the mempool from the specified API and return as Integer.
async function getMempoolCount(){
  let response = await fetch(adrMempool);
  if(response.ok){
    var jsresponse = await response.json();
  }
  else return errorMsg;
  return await jsresponse.count;
}

//Call the API for the hash of the latest block and make a seperate Call for the count of transactions in that specific block.
//Then divide the transaction count by 600 (seconds/block) and return the transactions per second value with a precision of two digits behind the point. 
async function getTPS(){
  let responseOne = await fetch(adrTipHash);
  if(responseOne.ok){
    var latestHash = await responseOne.text();
  }
  else{
    return errorMsg;
  }
  let responseTwo = await fetch(adrBlock+latestHash);
  if(responseTwo.ok){
    var jsLatestBlock = await responseTwo.json();
  }
  else return errorMsg;
  let transactionsInBlock = await jsLatestBlock.tx_count;
  let rawTPS = transactionsInBlock/600;
  return rawTPS.toFixed(2);
}

//Call the fee of the waiting transactions and divide by 100 (so as to get the value in bits) and return as Integer.
async function getMempoolFees(){
  let response = await fetch(adrMempool);
  if(response.ok){
    var jsMempool = await response.json();
  }
  else return errorMsg;
  let fees = jsMempool.total_fee;
  //console.log(fees/100);
  let rawFees = fees/100;
  return rawFees.toFixed(0);
}

//Main function. Calls the other functions every minute.
async function updateStats(){
  while(true){
    let blockHeight =  await getBlockheight();
    if(blockHeight != divBlockheight.innerHTML){
      divBlockheight.innerHTML = blockHeight;
      console.log("Blockheight updated to "+blockHeight);
    }
    let tps = await getTPS();
    if(tps != divTPS.innerHTML){
      divTPS.innerHTML = tps;
      console.log("TPS updated to "+tps);
    }
    let txCount = await getMempoolCount();
    if(txCount != divMempoolCount){
      divMempoolCount.innerHTML = txCount;
      console.log("Mempool transactions updated to "+txCount);
    }
    let memFee = await getMempoolFees();
    if(memFee != divMempoolFees){
      divMempoolFees.innerHTML = memFee;
      console.log("Mempool fees updated to "+memFee);
    }
    await sleep(updateInterval);
  }
}

updateStats();
