
async function main() {

    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const hoopsContract = await ethers.getContractFactory("HoopsBlock");
    const hoops = await hoopsContract.deploy();
  
    console.log("HoopsBlock address:", hoops.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });