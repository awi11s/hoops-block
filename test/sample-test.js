const { expect } = require("chai");
const { ethers } = require("hardhat");

let hoopsContract;
let hoops;
let caleb;
let austin;
let moose;
let chris;
let post;

beforeEach(async () => {
  hoopsContract = await ethers.getContractFactory("HoopsBlock");
  [austin, moose, chris, caleb] = await ethers.getSigners();

  hoops = await hoopsContract.deploy();

  post = await hoops.createPost(austin.address, 'first post');

});

describe("sports beats contract", () => {


    describe("posting", () => {
      it("post submits", async () => {
      
        await expect(post).to.emit(hoops, 'PostSubmitted');
        expect(await hoops.isPost(austin.address)).to.equal(true);
  
        
    
        // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
    
        // wait until the transaction is mined
        // await setGreetingTx.wait();
    
        // expect(await greeter.greet()).to.equal("Hola, mundo!");
      });

      it("author can't create multiple posts", async () => {
        await expect(
          hoops.createPost(austin.address, "second post"))
            .to.be.reverted;
      });
    });

    describe("voting", () => {

      it("author can't cast votes", async () => {
        await expect(hoops
          .connect(austin)
          .upVote(austin.address))
          .to.be.reverted;

        await expect(hoops
          .connect(austin)
          .downVote(austin.address))
          .to.be.reverted;
      });

      it("can upvote", async () => {
        const upvote = await hoops
          .connect(chris)
          .upVote(austin.address);

        await expect(upvote).to.emit(hoops, 'PostUpVoted');

      });

      it("can downvote", async () => {
        const downvote = await hoops
          .connect(chris)
          .downVote(austin.address);

        await expect(downvote).to.emit(hoops, 'PostDownVoted');
      });

      it("cant vote twice", async () => {
        await expect(hoops.connect(chris).upVote(austin.address)).to.emit(hoops, 'PostUpVoted');
        await expect(hoops.connect(chris).upVote(austin.address)).to.be.reverted;
      });
        
  

      it("limited downvotes bans post", async () => {
        const vote1 = await hoops.connect(chris).downVote(austin.address);
        const vote2 = await hoops.connect(caleb).downVote(austin.address);
        const vote3 = await hoops.connect(moose).downVote(austin.address);

        await expect(vote1).to.emit(hoops, 'PostDownVoted');
        await expect(vote2).to.emit(hoops, 'PostDownVoted');
        await expect(vote3).to.emit(hoops, 'PostRemoved'); 
      });
    });




});
