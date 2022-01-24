// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./NFTHandler.sol";
import "./interfaces/IPawnshop.sol";

contract Pawnshop is NFTHandler, IPawnshop, AccessControl {

	bytes32 public constant BACKEND_ROLE = keccak256("BACKEND_ROLE");

    uint256 dailyInterestRate;
    uint256 chunkSize;
    uint256 counter;
    
    constructor(uint256 _rate, uint256 _chunkSize){
        dailyInterestRate = _rate;
        chunkSize = _chunkSize;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(BACKEND_ROLE, _msgSender());
    }
    
    enum Status { Review, Open, ReadyToLend, Locked, Paid, ForSale, Sold, Terminated }
    
    struct Participant {
        address account;
        uint256 amount;
    }
    
    mapping(uint256 => Participant[]) participants;

    struct Lending {
        uint256 id;
        address borrower;
        uint256 amount;
        uint256 chunkPrice;
        uint256 debt;
        uint256 fund;
        
        uint256 dailyInterestRate;
        
        uint256 openingTime;
        uint256 reviewingTime;
        uint256 closingTime;
        uint256 startTime;
        uint256 endTime;
        uint256 debtTerm;
        
        uint256 tokenId;
        address tokenContract;
        
        Status status;
    }
    
    mapping(uint256 => Lending) lendings;
    
    event RefundLender (address indexed user, uint256 amount);
    event DistributedPayment (address indexed user, uint256 amount);
    
    function setDailyInterestRate(uint256 _rate) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        dailyInterestRate = _rate;
    }

    function getDailyInterestRate() view external override returns(uint256) {
        return dailyInterestRate;
    }
    
    function setChunkSize(uint256 _chunkSize) override external onlyRole(DEFAULT_ADMIN_ROLE) {
        chunkSize = _chunkSize;
    }
    
    function borrow(uint256 _amount, uint256 _expirationTerm, uint256 _debtTerm, uint256 _tokenId, address _tokenContract) public override{
        require(_amount >= chunkSize, "Amount requested is too small.");
        require(_amount%chunkSize == 0, "Please provide an amount in multiples of the chunk size.");
        require(_expirationTerm > 1, "Please provide an expiration term greater than 1 day.");
        require(_debtTerm > 1, "Please provide a debt term greater than 1 day.");
        
        uint256 openingTime = block.timestamp;
        // TODO: uint256 reviewingTime = block.timestamp+86400; // now + 1 day
        // MAKING IT 1 MIN JUST FOR TESTNG
        uint256 reviewingTime = block.timestamp+60; // now + 1 day
        // closingTime equals openingTime + X days
        // TODO: uint256 closingTime = openingTime+86400*_expirationTerm;
        // MAKING IT 1 MIN JUST FOR TESTING
        uint256 closingTime = openingTime+60*_expirationTerm;

        uint256 chunkPrice = chunkNFT(_amount);
        uint256 lendingId = counter;
        lendings[lendingId] = Lending(
            lendingId,
            msg.sender,
            _amount,
            chunkPrice,
            0,
            0,
            dailyInterestRate,
            openingTime,
            reviewingTime,
            closingTime,
            0,
            0,
            _debtTerm,
            _tokenId,
            _tokenContract,
            Status.Review
            );

        counter++;
    }
    
    function getChunkSize() view external returns(uint256) {
        return chunkSize;
    }
    
    function chunkNFT(uint256 _amount) view private returns(uint256) {
        require(_amount%chunkSize == 0, "Please provide an amount in multiples of the chunk size.");
        uint256 chunkPrice = _amount/chunkSize;
        
        return chunkPrice;
    }
    
    function getLending(uint256 _lendingId) public view returns (Lending memory) {
        return lendings[_lendingId];
    }

    function getParticipants(uint256 _lendingId) external view returns (Participant[] memory) {
        return participants[_lendingId];
    }
    
    function lend(uint256 _lendingId) external override payable {
        require(lendings[_lendingId].status == Status.Open, "Lending opportunity is not open.");
        require(msg.value >= lendings[_lendingId].chunkPrice, "Please provide an amount in multiples of the chunk size.");
        require(msg.value%lendings[_lendingId].chunkPrice == 0, "Please provide an amount in multiples of the chunk size.");
        require(msg.value <= (lendings[_lendingId].amount - lendings[_lendingId].fund), "Contribution to the fund exceeds amount requested by borrower.");
        
        lendings[_lendingId].fund += msg.value;
        
        if(lendings[_lendingId].fund == lendings[_lendingId].amount) {
            lendings[_lendingId].status = Status.ReadyToLend;
        }
        
        participants[_lendingId].push( Participant(msg.sender, msg.value));
    }
    
    function lockLending(uint256 _lendingId) private {
        require(lendings[_lendingId].fund == lendings[_lendingId].amount, "Cannot lock lending.");
        
        lendings[_lendingId].status = Status.Locked;
        lendings[_lendingId].startTime = block.timestamp;
        lendings[_lendingId].endTime = lendings[_lendingId].startTime + 60*lendings[_lendingId].debtTerm;//86400*lendings[_lendingId].debtTerm;
        uint256 interest = lendings[_lendingId].debtTerm*lendings[_lendingId].dailyInterestRate;
        lendings[_lendingId].debt = lendings[_lendingId].amount + interest;
        
    }
    
    function updateStatus(uint256 _lendingId) external override onlyRole(BACKEND_ROLE) returns(bool) {
        require(lendings[_lendingId].status != Status.Terminated, "Lending is terminated."); 
        uint256 currentTimestamp = block.timestamp;            

       if(lendings[_lendingId].status == Status.Review) {
            
            ERC721 xContract = ERC721(lendings[_lendingId].tokenContract);
            address currentOwner = xContract.ownerOf(lendings[_lendingId].tokenId);
            
            // if user transfered the NFT to the pawnshop, then set lending status to Open to receive funding
            if(currentOwner == address(this)){
                lendings[_lendingId].status = Status.Open;
            } else {
                // Otherwise, check if reviewing time has been exceeded, to terminate lending
                if(currentTimestamp > lendings[_lendingId].reviewingTime) {
                    lendings[_lendingId].status = Status.Terminated;
                }
            }
        
        } else if(lendings[_lendingId].status == Status.Open) {
            // If lending is open and did not complete funding on time, then terminate lending and return funds
            if(currentTimestamp >= lendings[_lendingId].closingTime){
                lendings[_lendingId].status = Status.Terminated;
                // Return funds to participants
                returnFunds(_lendingId);
                returnNFT(_lendingId);
            }        
        } else if(lendings[_lendingId].status == Status.ReadyToLend) {
            payable(lendings[_lendingId].borrower).transfer(lendings[_lendingId].amount);
            lockLending(_lendingId);
        } 
        else if(lendings[_lendingId].status == Status.Locked) {
            // If lending is locked and user did not pay on time, then terminate lending
            if(currentTimestamp >= lendings[_lendingId].endTime){
                lendings[_lendingId].status = Status.ForSale;
            }
        } else if(lendings[_lendingId].status == Status.Paid) {
            distributePayments(_lendingId);
            returnNFT(_lendingId);
            lendings[_lendingId].status = Status.Terminated;
        } else if(lendings[_lendingId].status == Status.Sold){
            distributePayments(_lendingId);
            lendings[_lendingId].status = Status.Terminated;
        }

        return true;
    }

    function singleStatusUpdater(uint256 _lendingid) external override onlyRole(BACKEND_ROLE) {}

    function returnFunds(uint256 _lendingId) private {
        uint256 participantsLen = participants[_lendingId].length;
        Participant[] memory lendParticipants = participants[_lendingId];

        if(participantsLen > 0) {
            for(uint256 i; i < participantsLen; i++) {
                payable(lendParticipants[i].account).transfer(lendParticipants[i].amount);
                emit RefundLender(lendParticipants[i].account, lendParticipants[i].amount);
            }
        }
    }
    
    function returnNFT(uint256 _lendingId) private {
        psTransferNFT(lendings[_lendingId].borrower, lendings[_lendingId].tokenId, lendings[_lendingId].tokenContract);
    }
    
    
    function pay(uint256 _lendingId) external payable override {
        require(msg.value == lendings[_lendingId].debt, "Payment must be equal to debt.");
        require(lendings[_lendingId].status == Status.Locked, "Payment not allowed, status: locked.");
        require(block.timestamp < lendings[_lendingId].endTime, "Payment not allowed, end time reached.");
        lendings[_lendingId].status = Status.Paid;
    }

    // ADDING FUNCTION TO BUY THE NFT 
    function buy(uint256 _lendingId)external payable override{
        require(msg.value == lendings[_lendingId].debt, "Check the price for this");
        require(lendings[_lendingId].status == Status.ForSale, "Payment not allowed, this NFT is not for sale yet");
        require(block.timestamp > lendings[_lendingId].endTime, "Payment not allowed, this NFT is not for sale yet");
        psTransferNFT(msg.sender, lendings[_lendingId].tokenId, lendings[_lendingId].tokenContract);
        lendings[_lendingId].status = Status.Sold;
    }
    
    function distributePayments(uint256 _lendingId) private {
        require(lendings[_lendingId].status == Status.Paid || lendings[_lendingId].status == Status.Sold, "Distribution of payments not allowed.");

        uint256 participantsLen = participants[_lendingId].length;

        if(participantsLen > 0) {
            for(uint256 i; i < participantsLen; i++) {
                uint256 proportion = participants[_lendingId][i].amount/lendings[_lendingId].amount;
                uint256 proportionalAmount = proportion*lendings[_lendingId].debt;
                payable(participants[_lendingId][i].account).transfer(proportionalAmount);
                emit DistributedPayment(participants[_lendingId][i].account, proportionalAmount);
            }
        }
    }
}
