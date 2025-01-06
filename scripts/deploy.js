const main = async () => {
    const profileImageFactory = await hre.ethers.getContractFactory(
        'VehicleSharing',
    )
    const vehicleSharing = await profileImageFactory.deploy()

    await vehicleSharing.deployed()

    console.log('Contract deployed to:', vehicleSharing.address)
}; (async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})()