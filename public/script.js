//-------------------------------web3.js setup----------------------------
// let contractAbi = require('./abi');
const contractAddress = '0xd9CCB772Ba4639A34dbc5e277fde4CD274fa5b5B'; 
let contract;
let accounts;
let currentuser;

const connectWallet = async() => {
  try {
	const web3 = new Web3(window.ethereum);
	accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(contractAbi, contractAddress);

    await window.ethereum.request({method: 'eth_requestAccounts'}).then((accounts) => {
		handleWalletConnected(accounts);
		localStorage.setItem('isWalletConnected', 'true');
	}).catch((err) => {
		displayAlert('danger', 'Error connecting wallet');
	});

	// const web3 = new Web3(window.ethereum);
	// accounts = await web3.eth.getAccounts();
    // contract = new web3.eth.Contract(contractAbi, contractAddress);
	currentuser = accounts[0];
	// getAllVehicleIds();
  } catch (err) {
    console.log(err);
    // alert("Metamask not installed");
	displayAlert('danger', err.message.toString());
  } 
}

document.getElementById('connectWalletBtn').addEventListener('click', ()=> {
	connectWallet();
});
  
const handleWalletConnected = async(accounts) => {
	try {
		const walletAddress = accounts[0];
		console.log("Wallet connected, address:", walletAddress);
		updateUI(walletAddress)
	} catch (err) {
		console.log(err);
		displayAlert('danger', err.message.toString());
	}
}

const updateUI = (walletAddress) => {
	try {
		const walletBtn = document.getElementById('connectWalletBtn');
		walletBtn.textContent = walletAddress;
		walletBtn.disabled = true; 
		walletBtn.classList.add('connected');
	} catch (err) {
		console.log(err);
		displayAlert('danger', err.message.toString());
	}
}


function displayAlert(type, message) {
    const alertContainer = $('#alertContainer');
    const alert = $('<div class="alert alert-dismissible">')
      .addClass(`alert-${type}`)
      .html(message)
      .append('<button type="button" class="close" data-dismiss="alert">&times;</button>');
	

    alertContainer.empty().append(alert);
}

