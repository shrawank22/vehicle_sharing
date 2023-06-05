// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract VehicleSharing is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Vehicle Data Type
    struct Vehicle {
        uint256 id;
        string[] vehicleData;
        uint256 pricePerHour;
        address currentRenter;
        address owner;
        address[] renters;
        bool isAvailable;
        uint256 deposit_bal;  // Amount need to be deposited by renter to rent the car
        uint256 temp_bal; 
        uint256 start;
        uint256 end;

        uint256 ratings;
        address[] ratingsByRenters;
        string[] reviews;
    }

    // User struct
    struct User {
        string name;
        string aadhar;
        address userAddress;
    }

    // Mappings
    mapping(address => User) public _users; 
    mapping(uint256 => Vehicle) public _vehicles;
    address public manager;
    uint256 vehicleRatingCnt = 0;

    // Events
    event RentCost(uint256 rent_cost);
    event Payment(uint256 payment);

    // Constructor
    constructor() ERC721("VehicleToken", "VT") {
        manager = msg.sender;
    }

    // Modifiers
    modifier onlyManager() {
        require(msg.sender == manager, "Unauthorized");
        _;
    }

    // Function to register user
    function registerUser(string memory name, string memory aadhar) external {
        require(_users[msg.sender].userAddress == address(0), "User is already registered");

        User storage user = _users[msg.sender];
        user.name = name;
        user.aadhar = aadhar;
        user.userAddress = msg.sender;
    }

    // Function to add vehilce 
    function addVehicle(address owner, string calldata typeVehicle, string calldata make, string calldata model, uint256 pricePerHour, uint256 deposit_price, string calldata imageHash) external onlyManager(){
        _tokenIdCounter.increment();
        uint256 vehicleId = _tokenIdCounter.current();
        _mint(msg.sender, vehicleId);

        Vehicle storage newVehicle = _vehicles[vehicleId];
        newVehicle.owner = owner;
        newVehicle.id = vehicleId;
        newVehicle.vehicleData.push(typeVehicle);
        newVehicle.vehicleData.push(make);
        newVehicle.vehicleData.push(model);
        newVehicle.vehicleData.push(imageHash);
        newVehicle.pricePerHour = pricePerHour * 1e18;
        newVehicle.deposit_bal = deposit_price * 1e18;
        newVehicle.currentRenter = address(0);
        newVehicle.isAvailable = true;
        newVehicle.temp_bal = 0;
        newVehicle.ratings = 0;
    }

    // Function to calculate rent_cost based on start and end values
    function calculateRentCost(uint256 vehicleId, uint256 start, uint256 end) external view returns (uint256, address) {
        require(start < end, "Invalid rental period");
        Vehicle storage vehicle = _vehicles[vehicleId];
        uint256 rent_cost = vehicle.deposit_bal + ((vehicle.pricePerHour * (end - start)) / 3600000);
        return (rent_cost, address(this));
    }

    // Function to rent vehicle
    function rentVehicle(uint256 vehicleId, uint256 start, uint256 end) external payable {
        require(start < end, "Invalid rental period");
        Vehicle storage vehicle = _vehicles[vehicleId];
        require(vehicle.currentRenter == address(0), "Vehicle is already rented");
        User storage user = _users[msg.sender];
        require(user.userAddress != address(0), "User is not registered");

        uint256 rent_cost = vehicle.deposit_bal + ((vehicle.pricePerHour * (end - start)) / 3600000);
        vehicle.temp_bal = rent_cost;
        vehicle.currentRenter = msg.sender;
        vehicle.renters.push(msg.sender);
        vehicle.isAvailable = false;
        vehicle.start = start;
        vehicle.end = end;
        _transfer(ownerOf(vehicleId), msg.sender, vehicleId);
    }

    // Function for getting the payment amount
    function calculatePayment(uint256 vehicleId) external view returns (uint256, address) {
        Vehicle storage vehicle = _vehicles[vehicleId];
        uint256 payment = ((vehicle.pricePerHour * ((block.timestamp * 1000) - vehicle.start)) / 3600000);
        return (payment, vehicle.owner);
    }

    // For returning the rented vehicle
    function returnVehicle(uint256 vehicleId) external payable  {
        Vehicle storage vehicle = _vehicles[vehicleId];
        require(vehicle.currentRenter == msg.sender, "You are not the renter of this vehicle");

        uint256 payment = ((vehicle.pricePerHour * ((block.timestamp * 1000) - vehicle.start)) / 3600000);

        emit Payment(payment);

        (bool sentPayment, ) = payable(vehicle.owner).call{value: payment}("");
        require(sentPayment, "Failed to send payment back to renter.");

        (bool remainPayment, ) = payable(msg.sender).call{value: vehicle.temp_bal - payment}(""); // getBalance(address(this))
        require(remainPayment, "Failed to send payment back to renter.");


        vehicle.currentRenter = address(0);
        vehicle.isAvailable = true;
        _transfer(ownerOf(vehicleId), manager, vehicleId);
    }

    // For getting account balance
    function getBalance(address account) public view returns (uint256) {
        return account.balance;
    }

    // Function for getting vehicle details
    function getVehicleDetails(uint256 vehicleId) external view returns (uint256, string memory, string memory, string memory, uint256, uint256, address, address[] memory, string memory, bool, uint256) {
        Vehicle storage vehicle = _vehicles[vehicleId];
        return (
            vehicle.id,
            vehicle.vehicleData[0],
            vehicle.vehicleData[1],
            vehicle.vehicleData[2],
            vehicle.pricePerHour,
            vehicle.deposit_bal,
            vehicle.currentRenter,
            vehicle.renters,
            vehicle.vehicleData[3],
            vehicle.isAvailable,
            vehicle.ratings
        );
    }

    // Function for rating the vehicle
    function rateVehicle(uint256 vehicleId, uint256 rating, string memory review) external {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        Vehicle storage vehicle = _vehicles[vehicleId];

        require(doesRenterExist(vehicleId, msg.sender), "You have never rented this vehicle. Fuck you");
        require(doesRenterRated(vehicleId, msg.sender) == false, "You have already rated this vehicle");
        vehicleRatingCnt++;
        vehicle.ratings += rating * 10000;
        vehicle.ratings /= vehicleRatingCnt;
        vehicle.ratingsByRenters.push(msg.sender);
        vehicle.reviews.push(review);
    }

    //-----------------------------Helping functions--------------------------
    function getVehicleIds() external view returns (uint256[] memory) {
        uint256[] memory vehicleIds = new uint256[](_tokenIdCounter.current());
        for (uint256 i = 1; i <= _tokenIdCounter.current(); i++) {
            vehicleIds[i - 1] = i;
        }
        return vehicleIds;
    }

    function doesRenterExist(uint256 vehicleId, address renter) public view returns (bool) {
        Vehicle storage vehicle = _vehicles[vehicleId];
        for (uint256 i = 0; i < vehicle.renters.length; i++) {
            if (vehicle.renters[i] == renter) {
                return true;
            }
        }
        return false;
    }

    function doesRenterRated(uint256 vehicleId, address renter) public view returns (bool) {
        Vehicle storage vehicle = _vehicles[vehicleId];
        for (uint256 i = 0; i < vehicle.ratingsByRenters.length; i++) {
            if (vehicle.ratingsByRenters[i] == renter) {
                return true;
            }
        }
        return false;
    }
}
