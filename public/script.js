//-------------------------------web3.js setup----------------------------
// let contractAbi = require('./abi');
const contractAddress = '0x2D5a388A28AE508f1eA171bC8a535331C7E18323';

let contract;
let accounts;
let currentuser;

const connectWallet = async () => {
	try {
		const web3 = new Web3(window.ethereum);
		accounts = await web3.eth.getAccounts();
		contract = new web3.eth.Contract(contractAbi, contractAddress);

		await window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
			handleWalletConnected(accounts);
			localStorage.setItem('isWalletConnected', 'true');
			getAllVehicleIds();
			registerFunction();
			rateVehicleFun();
		}).catch((err) => {
			displayAlert('danger', 'Error connecting wallet');
		});
		currentuser = accounts[0];
		// getAllVehicleIds();
		checkVehicleformVisibility();
		getBalance();
	} catch (err) {
		console.log(err);
		// alert("Metamask not installed");
		displayAlert('danger', err.message.toString());
	}
}

function connectWalletOnPageLoad() {
	if (localStorage.getItem('isWalletConnected') === 'true') {
		connectWallet();
	}
}

window.addEventListener('DOMContentLoaded', () => {
	connectWalletOnPageLoad();
});

document.getElementById('connectWalletBtn').addEventListener('click', () => {
	connectWallet();
});

document.getElementById('balanceBtn').addEventListener('click', () => {
	getBalance();
});

const getBalance = async () => {
	try {
		const balance = await contract.methods.getBalance(currentuser).call({ from: currentuser });
		console.log(balance)
	} catch (err) {
		displayAlert('danger', err.message);
	}
}

const handleWalletConnected = async (accounts) => {
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

const getAllVehicleIds = async () => {
	contract.methods.getVehicleIds().call().then((vehicleIds) => {
		// console.log(vehicleIds);
		getDetails(vehicleIds);
	}).catch((err) => {
		console.log(err);
		displayAlert('danger', err.message.toString());
	});
}

const getDetails = async (vehicleIds) => {
	try {
		vehicleIds.forEach(vehicleId => {
			contract.methods.getVehicleDetails(vehicleId).call((error, result) => {
				if (error) {
					console.log(error);
				} else {
					displayVehicleDetails(result);
				}
			});
		});
	} catch (err) {
		console.log(err);
		displayAlert('danger', err.message.toString());
	}
}

const displayVehicleDetails = async (result) => {
	try {
		const tableBody = document.getElementById('vehicle-details');
		const newRow = tableBody.insertRow();

		// Insert cells in the new row
		const vehicleIdCell = newRow.insertCell();
		const typeCell = newRow.insertCell();
		const makeCell = newRow.insertCell();
		const modelCell = newRow.insertCell();
		const priceCell = newRow.insertCell();
		const depositCell = newRow.insertCell();
		// const currentRenterCell = newRow.insertCell();
		// const rentersCell = newRow.insertCell();
		const imageCell = newRow.insertCell();
		const isAvailableCell = newRow.insertCell();
		const ratingsCell = newRow.insertCell();

		vehicleIdCell.textContent = result[0];
		typeCell.textContent = result[1];
		makeCell.textContent = result[2];
		modelCell.textContent = result[3];
		priceCell.textContent = result[4] / 1e18;
		depositCell.textContent = result[5] / 1e18;
		// currentRenterCell.textContent = result[6];

		// const ul = document.createElement('ul');
		// result[7].forEach(address => {
		// 	const li = document.createElement('li');
		// 	li.textContent = address;
		// 	ul.appendChild(li);
		// });
		// rentersCell.appendChild(ul);


		const imageBtn = document.createElement('button');
		imageBtn.textContent = "View";
		imageBtn.style.borderRadius = "5px";
		imageBtn.classList.add("btn", "btn-primary");
		imageBtn.addEventListener('click', () => {
			const linkUrl = "https://ipfs.io/ipfs/" + result[8];
			window.open(linkUrl, "_blank");

		});
		imageCell.appendChild(imageBtn);

		// isAvailableCell.textContent = result[7];
		if (result[9] == false) {
			// const rentedByCurrentUser = result[7].includes(currentUser);
			if (currentuser === result[6]) {
				const returnButton = document.createElement('button');
				returnButton.textContent = "Return";
				returnButton.style.borderRadius = "5px";
				returnButton.classList.add("btn", "btn-danger");
				returnButton.addEventListener('click', () => {
					returnVehicle(result[0]);
					// console.log(result[0])
				});
				isAvailableCell.appendChild(returnButton);
			} else {
				isAvailableCell.textContent = "N/A";
			}
		} else {
			const rentButton = document.createElement('button');
			rentButton.textContent = "Rent";
			rentButton.style.borderRadius = "5px";
			rentButton.classList.add("btn", "btn-success");

			const formContainer = document.createElement('div');
			formContainer.classList.add("form-group");

			formContainer.style.display = "none";

			const form = document.createElement('form');

			const vehicleIdInput = document.createElement('input');
			vehicleIdInput.classList.add("form-control")
			vehicleIdInput.type = "text";
			vehicleIdInput.value = "vehicleId = " + result[0];
			vehicleIdInput.disabled = true;
			vehicleIdInput.style.marginBottom = "5px";
			form.appendChild(vehicleIdInput);

			const startDateInput = document.createElement('input');
			startDateInput.classList.add("form-control")
			startDateInput.type = "datetime-local";
			startDateInput.name = "startDate";
			startDateInput.style.marginBottom = "5px";
			startDateInput.placeholder = "Start Date";
			const currentDate = new Date().toISOString().slice(0, 16);
			startDateInput.min = currentDate;
			form.appendChild(startDateInput);

			const endDateInput = document.createElement('input');
			endDateInput.classList.add("form-control")
			endDateInput.type = "datetime-local";
			endDateInput.name = "endDate";
			endDateInput.placeholder = "End Date";
			endDateInput.min = currentDate;
			form.appendChild(endDateInput);

			const submitButton = document.createElement('button');
			submitButton.classList.add('btn', 'btn-primary');
			submitButton.type = "submit";
			submitButton.textContent = "Submit";
			submitButton.style.borderRadius = "10px";
			form.appendChild(submitButton);

			formContainer.appendChild(form);

			rentButton.addEventListener('click', (event) => {
				event.preventDefault();
				if (formContainer.style.display === "none") {
					formContainer.style.display = "block";
				} else {
					formContainer.style.display = "none";
				}
				event.stopPropagation();
			});

			form.addEventListener('submit', (event) => {
				event.preventDefault();

				const startDateValue = startDateInput.value;
				const endDateValue = endDateInput.value;

				const startDate = new Date(startDateValue).getTime();
				const endDate = new Date(endDateValue).getTime();

				// console.log(startDate);
				rentVehicle(result[0], startDate, endDate);
			});

			isAvailableCell.appendChild(rentButton);
			isAvailableCell.appendChild(formContainer);
		}
		ratingsCell.textContent = result[10] / 10000;

	} catch (err) {
		console.log(err);
		displayAlert('danger', err.message.toString());
	}
}

const rentVehicle = async (vehicleId, startDate, endDate) => {
	try {
		if (startDate >= endDate) {
			throw new Error('Invalid Rental Period');
		}

		const vehicle = await contract.methods._vehicles(vehicleId).call();
		if (vehicle.currentRenter !== '0x0000000000000000000000000000000000000000') {
			throw new Error('Vehicle is already rented');
		}
		const user = await contract.methods._users(currentuser).call();
		// console.log(user);
		if (user.userAddress === '0x0000000000000000000000000000000000000000') {
			throw new Error('User is not registered!');
		}

		await contract.methods.calculateRentCost(vehicleId, startDate, endDate).call().then((result) => {
			const rent_cost = result[0];
			const address1 = result[1];
			contract.methods.rentVehicle(vehicleId, startDate, endDate).send({ from: currentuser, to: address1, value: rent_cost,  gasPrice: "30000000000" }).on('transactionHash', (hash) => {
				console.log('Transaction hash:', hash);
			}).on('receipt', (receipt) => {
				console.log('Transaction receipt:', receipt);
				setTimeout(reloadPage, 1000);
			}).on('error', (err) => {
				displayAlert('danger', err.message);
			});
		}).catch((err) => {
			displayAlert('danger', err.message);
		});
	} catch (err) {
		console.log(err.message);
		displayAlert('danger', err.message.toString());
	}
}

const returnVehicle = async (vehicleId) => {
	try {
		const vehicle = await contract.methods._vehicles(vehicleId).call();
		// console.log(vehicle)
		if (vehicle.currentRenter !== currentuser) {
			throw new Error('You are not the renter of this vehicle')
		}

		// await contract.methods.calculatePayment(vehicleId).call().then((result) => { 
		// 	const payment = result[0];
		// 	const vehicle_owner = result[1];

		contract.methods.returnVehicle(vehicleId).send({ from: currentuser,  gasPrice: "30000000000" });

		// 	// setTimeout(reloadPage, 1000);
		// }).catch((err) => {
		// 	console.log(err);
		// 	displayAlert('danger', err.message);
		// });
	} catch (err) {
		console.log(err);
		displayAlert('danger', err.message.toString());
	}
}

const checkVehicleformVisibility = async () => {
	try {
		const manager = await contract.methods.manager().call();
		if (manager === currentuser) {
			const addVehicle = document.getElementById("addVehicle");
			addVehicle.classList.remove("hidden");
			addVehicle.classList.add('btn', 'btn-primary');

			const formContainer = document.getElementById('formContainer');
			const regContainer = document.getElementById('regContainer');
			const vehicleDetails = document.getElementById('vehicleDetails');
			addVehicle.addEventListener('click', () => {
				// formContainer.classList.toggle('active');
				if (formContainer.style.display === "none") {
					formContainer.style.display = "block";
					vehicleDetails.style.display = "none";
				} else {
					setTimeout(reloadPage, 10000);
					formContainer.style.display = "none";
					vehicleDetails.style.display = "block";
				}

				if (regContainer.style.display !== "none") {
					regContainer.style.display = "none";
					vehicleDetails.style.display = "none";
				}
			});

			const form = document.getElementById("vehicleForm");
			form.classList.remove("hidden");
			form.addEventListener("submit", (event) => {
				event.preventDefault(); // Prevent form submission

				const type = document.getElementById("typeInput").value;
				const make = document.getElementById("makeInput").value;
				const model = document.getElementById("modelInput").value;
				const price = document.getElementById("priceInput").value;
				const deposit = document.getElementById("depositInput").value;
				const image = document.getElementById("imageInput").value;
				const owner = document.getElementById("ownerInput").value;

				createVehicle(owner, type, make, model, price, deposit, image);
			});
		}
	} catch (err) {
		console.log(err);
		displayAlert('danger', err.message.toString());
	}
}

const createVehicle = async (owner, type, make, model, price, deposit, image) => {
	try {
		console.log(contract);
		const vehicle = await contract.methods.addVehicle(owner, type, make, model, price, deposit, image).send({ from: accounts[0], gasPrice: "30000000000" });
		console.log(vehicle);
		displayAlert('success', "Vehicle added successfully!")
		setTimeout(reloadPage, 2000);
	} catch (err) {
		console.log(err);
		displayAlert('danger', err.mesage);
	}
}

const registerFunction = async () => {
	try {
		const registerBtn = document.getElementById("registerBtn");
		registerBtn.classList.remove("hidden");
		registerBtn.classList.add('btn', 'btn-primary');

		const regContainer = document.getElementById('regContainer');
		const formContainer = document.getElementById('formContainer');
		const vehicleDetails = document.getElementById('vehicleDetails');
		registerBtn.addEventListener('click', () => {
			// regContainer.classList.toggle('active');
			if (regContainer.style.display === "none") {
				regContainer.style.display = "block";
				vehicleDetails.style.display = "none";
			} else {
				regContainer.style.display = "none";
				vehicleDetails.style.display = "block";
			}
			if (formContainer.style.display !== "none") {
				formContainer.style.display = "none";
				vehicleDetails.style.display = "none";
			}
		});

		const form = document.getElementById("registrationForm");
		form.classList.remove("hidden");
		form.addEventListener("submit", (event) => {
			event.preventDefault(); // Prevent form submission

			const name = document.getElementById("name").value;
			const aadhar = document.getElementById("aadhar").value;

			registerUser(name, aadhar);
			regContainer.style.display = "none";
			vehicleDetails.style.display = "block";

		});
	} catch (err) {
		displayAlert('danger', err.mesage.toString());
	}

}

const registerUser = async (name, aadhar) => {
	try {
		const user = await contract.methods._users(currentuser).call();
		if (user.userAddress !== '0x0000000000000000000000000000000000000000') {
			throw new Error('User is already registered');
		}
		console.log(user, name, aadhar, currentuser);
		await contract.methods.registerUser(name, aadhar).send({ from: currentuser, gasPrice: "30000000000" });
		displayAlert('success', 'User registered successfully');
		// console.log(user);
		setTimeout(reloadPage, 3000);
	} catch (err) {
		console.log(err);
		displayAlert('danger', err.message.toString());
	}
}

const rateVehicleFun = async () => {
	try {
		const rateBtn = document.getElementById("rateBtn");
		rateBtn.classList.remove("hidden");
		rateBtn.classList.add('btn', 'btn-primary');

		const ratingContainer = document.getElementById("ratingContainer");

		rateBtn.addEventListener('click', () => {
			ratingContainer.classList.toggle('active');
		});

		const form = document.getElementById("ratingForm");
		form.classList.remove("hidden");
		form.addEventListener("submit", (event) => {
			event.preventDefault(); // Prevent form submission

			const vehicleId = document.getElementById("vehicle_id").value;
			const rating = document.getElementById("rating").value;
			const review = document.getElementById("review").value;

			rateVehicle(vehicleId, rating, review);
		});

	} catch (err) {
		displayAlert('danger', err.mesage);
	}
}

const rateVehicle = async (vehicleId, rating, review) => {
	try {
		await contract.methods.doesRenterExist(vehicleId, currentuser).call().then((res) => {
			if (!res) {
				throw new Error("You have never rented this vehicle. Fuck you");
			}

			contract.methods.doesRenterRated(vehicleId, currentuser).call().then((result) => {
				console.log(result);
				if (result) {
					throw new Error("You have already rated in past.")
				} else {
					contract.methods.rateVehicle(vehicleId, rating, review).send({ from: currentuser,  gasPrice: "30000000000" });
				}
			}).catch((err) => {
				displayAlert('danger', err);
			});
		}).catch((err) => {
			displayAlert('danger', err);
		});
	} catch (err) {
		console.log(err);
		displayAlert('danger', err.mesage);
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

function reloadPage() {
	location.reload();
}


