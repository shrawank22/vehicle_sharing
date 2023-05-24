// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VehicleSharing is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Vehicle {
        uint256 id;
        string typeVehicle;
        string make;
        string model;
        uint256 pricePerHour;
        address currentRenter;
        // address owner;
        address[] renters;
        bool isAvailable;
        uint256 deposit_bal;  // amount deposited by user to rent the car
        uint256 balance; // Balance earned by car owner from renting
        uint256 temp_bal;
        uint256 start;
        uint256 end;
    }

    struct User {
        string name;
        string aadhar;
        uint256 balance; // balance of user
        uint256 locked_bal; // locked-balance
        address userAddress;
    }

    mapping(address => User) public _users;
    mapping(uint256 => Vehicle) public _vehicles;
    address public manager;
    uint256 private rentCount;

    constructor() ERC721("VehicleToken", "VT") {
        manager = msg.sender;
        rentCount = 0;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Unauthorized");
        _;
    }

    function registerUser(string memory name, string memory aadhar) external {
        require(_users[msg.sender].userAddress == address(0), "User is already registered");
        // require(msg.sender != manager, "You are admin");

        User storage user = _users[msg.sender];
        user.name = name;
        user.balance = 65978657865478654;
        user.locked_bal = 0;
        user.aadhar = aadhar;
        user.userAddress = msg.sender;
    }

    function addVehicle(string memory typeVehicle, string memory make, string memory model, uint256 pricePerHour, uint256 deposit_price) external onlyManager(){
        _tokenIdCounter.increment();
        uint256 vehicleId = _tokenIdCounter.current();
        _mint(msg.sender, vehicleId);

        Vehicle storage newVehicle = _vehicles[vehicleId];
        newVehicle.id = vehicleId;
        newVehicle.typeVehicle = typeVehicle;
        newVehicle.make = make;
        newVehicle.model = model;
        newVehicle.pricePerHour = pricePerHour;
        newVehicle.deposit_bal = deposit_price;
        newVehicle.currentRenter = address(0);
        newVehicle.isAvailable = true;
        newVehicle.balance = 0;
        newVehicle.temp_bal = 0;
    }

    function rentVehicle(uint256 vehicleId, uint256 start, uint256 end) external payable {
        require(start < end, "Invalid rental period");
        Vehicle storage vehicle = _vehicles[vehicleId];
        require(vehicle.currentRenter == address(0), "Vehicle is already rented");
        User storage user = _users[msg.sender];
        require(user.userAddress != address(0), "User is not registered");

        // other logic
        uint256 rent_cost = vehicle.deposit_bal + (vehicle.pricePerHour * ((end - start) / 1 hours));
        require(user.balance >= rent_cost, "Insufficient funds");
        user.balance -= rent_cost;
        user.locked_bal += rent_cost;
        rentCount++;
        vehicle.temp_bal = rent_cost;
        vehicle.currentRenter = msg.sender;
        vehicle.renters.push(msg.sender);
        vehicle.isAvailable = false;
        vehicle.start = start;
        vehicle.end = end;
        // transferFrom(ownerOf(vehicleId), msg.sender, vehicleId);
        _transfer(ownerOf(vehicleId), msg.sender, vehicleId);
    }

    function returnVehicle(uint256 vehicleId) external {
        Vehicle storage vehicle = _vehicles[vehicleId];
        require(vehicle.currentRenter == msg.sender, "You are not the renter of this vehicle");

        vehicle.currentRenter = address(0);
        vehicle.isAvailable = true;
        _transfer(ownerOf(vehicleId), manager, vehicleId);
    }
}