const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

const TOKEN_CONTRACT = "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb";

describe("Pawnshop contract following path when paying debt", function () {
  let owner;
  let account1;
  let Pawnshop;
  let NFTMinter;
  let hardhatPawnshop;
  let hardhatNFTMinter;

  beforeEach(async function () {
    [owner, account1] = await ethers.getSigners();

    Pawnshop = await ethers.getContractFactory("Pawnshop");
    NFTMinter = await ethers.getContractFactory("NFTMinter");

    hardhatPawnshop = await Pawnshop.deploy(1000, 1000);
    hardhatNFTMinter = await NFTMinter.deploy("NMT Token", "NMT");
  });
  it("Get chunk size", async function () {
    const chunkSize = await hardhatPawnshop.getChunkSize();

    expect(chunkSize).to.equal(1000);
  });
  it("Set chunk size", async function () {
    await hardhatPawnshop.setChunkSize(10000);
    const chunkSize = await hardhatPawnshop.getChunkSize();
    expect(chunkSize).to.equal(10000);
  });

  it("Get daily interest rate", async function () {
    const dailyInterestRate = await hardhatPawnshop.getDailyInterestRate();
    expect(dailyInterestRate).to.equal(1000);
  });
  it("Set daily interest rate", async function () {
    await hardhatPawnshop.setDailyInterestRate(10000);
    const dailyInterestRate = await hardhatPawnshop.getDailyInterestRate();
    expect(dailyInterestRate).to.equal(10000);
  });
  it("Request borrow", async function () {
    await hardhatPawnshop.borrow(2000000000, 2, 2, 1, TOKEN_CONTRACT);
    const lending = await hardhatPawnshop.getLending(0);
    expect(lending.id).to.equal(0);
  });
  it("updateStatus: from status review to open", async function () {
    await hardhatNFTMinter.mint(hardhatPawnshop.address, 0, "x");
    await hardhatPawnshop.borrow(2000000000, 2, 2, 0, hardhatNFTMinter.address);
    await hardhatPawnshop.updateStatus(0);
    const lending = await hardhatPawnshop.getLending(0);
    expect(lending.status).to.equal(1);
  });
  it("Test lend and verify participants", async function () {
    const nftContractAddress = hardhatNFTMinter.address;
    await hardhatNFTMinter.mint(hardhatPawnshop.address, 0, "x");
    await hardhatPawnshop.borrow(2000000000, 2, 2, 0, nftContractAddress);
    await hardhatPawnshop.updateStatus(0);
    await hardhatPawnshop.lend(0, {
      value: 1000000000,
    });

    const participants = await hardhatPawnshop.getParticipants(0);
    expect(participants.length).to.equal(1);
  });
  it("Test lend and complete funding", async function () {
    const nftContractAddress = hardhatNFTMinter.address;
    await hardhatNFTMinter.mint(hardhatPawnshop.address, 0, "x");
    await hardhatPawnshop.borrow(2000000000, 2, 2, 0, nftContractAddress);
    await hardhatPawnshop.updateStatus(0);
    await hardhatPawnshop.lend(0, {
      value: 2000000000,
    });

    const lending = await hardhatPawnshop.getLending(0);
    expect(lending.status).to.equal(2);
  });
  it("updateStatus: up to Status.Locked by lending the fund", async function () {
    const nftContractAddress = hardhatNFTMinter.address;
    await hardhatNFTMinter.mint(hardhatPawnshop.address, 0, "x");
    await hardhatPawnshop.borrow(2000000000, 2, 2, 0, nftContractAddress);
    await hardhatPawnshop.updateStatus(0);
    await hardhatPawnshop.lend(0, {
      value: 2000000000,
    });
    await hardhatPawnshop.updateStatus(0);
    const lending = await hardhatPawnshop.getLending(0);

    expect(lending.status).to.equal(3);
  });
  it("updateStatus: up to Status.Paid by paying the debt", async function () {
    const nftContractAddress = hardhatNFTMinter.address;
    await hardhatNFTMinter.mint(hardhatPawnshop.address, 0, "x");
    await hardhatPawnshop.borrow(2000000000, 2, 2, 0, nftContractAddress);
    await hardhatPawnshop.updateStatus(0);
    await hardhatPawnshop.lend(0, {
      value: 2000000000,
    });
    await hardhatPawnshop.updateStatus(0);
    let lending = await hardhatPawnshop.getLending(0);
    await hardhatPawnshop.pay(0, {
      value: lending.debt,
    });
    lending = await hardhatPawnshop.getLending(0);
    expect(lending.status).to.equal(4);
  });

  it("updateStatus: up to Status.Terminated after paying debt", async function () {
    const nftContractAddress = hardhatNFTMinter.address;
    await hardhatNFTMinter.mint(hardhatPawnshop.address, 0, "x");
    await hardhatPawnshop.borrow(2000000000, 2, 2, 0, nftContractAddress);
    await hardhatPawnshop.updateStatus(0);
    await hardhatPawnshop.lend(0, {
      value: 2000000000,
    });
    await hardhatPawnshop.updateStatus(0);
    let lending = await hardhatPawnshop.getLending(0);
    await hardhatPawnshop.pay(0, {
      value: lending.debt,
    });
    await hardhatPawnshop.updateStatus(0);
    lending = await hardhatPawnshop.getLending(0);
    expect(lending.status).to.equal(7);
  });
});

describe("Pawnshop contract following path when NOT paying debt", function () {
  let owner;
  let account1;
  let Pawnshop;
  let NFTMinter;
  let hardhatPawnshop;
  let hardhatNFTMinter;

  beforeEach(async function () {
    [owner, account1] = await ethers.getSigners();

    Pawnshop = await ethers.getContractFactory("Pawnshop");
    NFTMinter = await ethers.getContractFactory("NFTMinter");

    hardhatPawnshop = await Pawnshop.deploy(1000, 1000);
    hardhatNFTMinter = await NFTMinter.deploy("NMT Token", "NMT");
  });
  it("statusUpdater: up to Status.ForSale when NOT paying debt", async function () {
    const nftContractAddress = hardhatNFTMinter.address;
    await hardhatNFTMinter.mint(hardhatPawnshop.address, 0, "x");
    await hardhatPawnshop.borrow(2000000000, 2, 2, 0, nftContractAddress);
    await hardhatPawnshop.updateStatus(0);
    await hardhatPawnshop.lend(0, {
      value: 2000000000,
    });
    await hardhatPawnshop.updateStatus(0);
    let lending = await hardhatPawnshop.getLending(0);
    // wait for payment due date to expire
    await network.provider.send("evm_increaseTime", [60 * 2]);
    await network.provider.send("evm_mine");

    await hardhatPawnshop.updateStatus(0);
    lending = await hardhatPawnshop.getLending(0);
    expect(lending.status).to.equal(5);
  });
  it("statusUpdater: up to Status.Sold when buying an NFT for sale", async function () {
    const nftContractAddress = hardhatNFTMinter.address;
    await hardhatNFTMinter.mint(hardhatPawnshop.address, 0, "x");
    await hardhatPawnshop.borrow(2000000000, 2, 2, 0, nftContractAddress);
    await hardhatPawnshop.updateStatus(0);
    await hardhatPawnshop.lend(0, {
      value: 2000000000,
    });
    await hardhatPawnshop.updateStatus(0);
    let lending = await hardhatPawnshop.getLending(0);
    // wait for payment due date to expire
    await network.provider.send("evm_increaseTime", [60 * 2]);
    await network.provider.send("evm_mine");

    await hardhatPawnshop.updateStatus(0);
    lending = await hardhatPawnshop.getLending(0);

    // buy NFT
    await hardhatPawnshop.buy(0, {
      value: lending.debt,
    });

    lending = await hardhatPawnshop.getLending(0);

    expect(lending.status).to.equal(6);
  });
  it("statusUpdater: up to Status.Terminated when NFT is sold", async function () {
    const nftContractAddress = hardhatNFTMinter.address;
    await hardhatNFTMinter.mint(hardhatPawnshop.address, 0, "x");
    await hardhatPawnshop.borrow(2000000000, 2, 2, 0, nftContractAddress);
    await hardhatPawnshop.updateStatus(0);
    await hardhatPawnshop.lend(0, {
      value: 2000000000,
    });
    await hardhatPawnshop.updateStatus(0);
    let lending = await hardhatPawnshop.getLending(0);
    // wait for payment due date to expire
    await network.provider.send("evm_increaseTime", [60 * 2]);
    await network.provider.send("evm_mine");

    await hardhatPawnshop.updateStatus(0);
    lending = await hardhatPawnshop.getLending(0);

    // buy NFT
    await hardhatPawnshop.buy(0, {
      value: lending.debt,
    });

    await hardhatPawnshop.updateStatus(0);

    lending = await hardhatPawnshop.getLending(0);

    expect(lending.status).to.equal(7);
  });
});

describe("Update status scenarios cases", () => {
  let owner;
  let account1;
  let Pawnshop;
  let NFTMinter;
  let hardhatPawnshop;
  let hardhatNFTMinter;

  beforeEach(async function () {
    [owner, account1] = await ethers.getSigners();

    Pawnshop = await ethers.getContractFactory("Pawnshop");
    NFTMinter = await ethers.getContractFactory("NFTMinter");

    hardhatPawnshop = await Pawnshop.deploy(1000, 1000);
    hardhatNFTMinter = await NFTMinter.deploy("NMT Token", "NMT");

    await hardhatNFTMinter.mint(account1.address, 0, "x");
    await hardhatPawnshop.borrow(2000000000, 2, 2, 0, hardhatNFTMinter.address);
  });

  it("Refunds users when lending did not complete funding on time", async () => {
    await hardhatNFTMinter
      .connect(account1)
      .transfer(hardhatPawnshop.address, 0);
    await hardhatPawnshop.updateStatus(0);
    await hardhatPawnshop.lend(0, {
      value: 1000000000,
    });

    const blockNumberBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumberBefore);
    const timestampBefore = blockBefore.timestamp;
    await ethers.provider.send("evm_mine", [timestampBefore + 60 * 3]);

    const [lender01] = await hardhatPawnshop.getParticipants(0);
    await expect(hardhatPawnshop.updateStatus(0))
      .to.emit(hardhatPawnshop, "RefundLender")
      .withArgs(lender01.account, lender01.amount);
    const lending = await hardhatPawnshop.getLending(0);
    expect(lending.status).to.equal(7);
  });

  it("Reverts if lending status is terminated", async function () {
    await hardhatNFTMinter
      .connect(account1)
      .transfer(hardhatPawnshop.address, 0);
    await hardhatPawnshop.updateStatus(0);
    await hardhatPawnshop.lend(0, {
      value: 2000000000,
    });
    await hardhatPawnshop.updateStatus(0);
    let lending = await hardhatPawnshop.getLending(0);
    await hardhatPawnshop.pay(0, {
      value: lending.debt,
    });
    await hardhatPawnshop.updateStatus(0);
    lending = await hardhatPawnshop.getLending(0);
    expect(lending.status).to.equal(7);

    await expect(hardhatPawnshop.updateStatus(0)).to.be.revertedWith(
      "Lending is terminated"
    );
  });

  it("Terminate lending if review time has been exceeded", async () => {
    const blockNumberBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumberBefore);
    const timestampBefore = blockBefore.timestamp;
    await ethers.provider.send("evm_mine", [timestampBefore + 60 * 2]);

    await hardhatPawnshop.updateStatus(0);
    const lending = await hardhatPawnshop.getLending(0);
    expect(lending.status).to.equal(7);
  });
});
