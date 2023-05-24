// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
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
        address[] renters;
    }

    struct User {
        string name;
        uint256 balance;
        address userAddress;
        bool isVerified;
    }

    mapping(address => User) private _users;
    mapping(uint256 => Vehicle) private _vehicles;
    address private manager;
    address private verifier;
    uint256 private rentCount;

    constructor(address _verifier) ERC721("VehicleToken", "VT") {
        manager = msg.sender;
        rentCount = 0;
        verifier = _verifier;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Unauthorized");
        _;
    }

    modifier onlyVerifier() {
        require(msg.sender == verifier, "Unauthorized");
        _;
    }


    function registerUser(string memory name, uint256 _balance) external {
        require(_users[msg.sender].userAddress == address(0), "User is already registered");

        User storage user = _users[msg.sender];
        user.name = name;
        user.balance = _balance;
        user.userAddress = msg.sender;
        user.isVerified = false;
    }

    function verifyuser (address userAdd) public onlyVerifier() {
        User storage user = _users[userAdd];
        user.isVerified = true;
    }

    function addVehicle(string memory typeVehicle, string memory make, string memory model, uint256 pricePerHour) external onlyManager(){
        _tokenIdCounter.increment();
        uint256 vehicleId = _tokenIdCounter.current();
        _mint(msg.sender, vehicleId);

        Vehicle storage newVehicle = _vehicles[vehicleId];
        newVehicle.id = vehicleId;
        newVehicle.typeVehicle = typeVehicle;
        newVehicle.make = make;
        newVehicle.model = model;
        newVehicle.pricePerHour = pricePerHour;
        newVehicle.currentRenter = address(0);
    }

    function rentVehicle(uint256 vehicleId) external payable {
        Vehicle storage vehicle = _vehicles[vehicleId];
        require(vehicle.currentRenter == address(0), "vehicle is already rented");
        User storage user = _users[msg.sender];
        require(user.userAddress != address(0), "User is not registered");
        require(user.isVerified, "User is not verified");

        // other logic
    }

}
