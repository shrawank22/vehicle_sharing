const VehicleSharingPlatform = artifacts.require("VehicleSharing");

module.exports = (deployer, network, accounts) => {
  const verifierAdd = accounts[0];
  deployer.deploy(VehicleSharingPlatform, verifierAdd);
};