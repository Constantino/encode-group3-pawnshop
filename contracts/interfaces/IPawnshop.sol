// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPawnshop {
    // Emitteed when a borrower calls borrow
    event LendingRegistered (uint256 lendingId, address asset, uint256 amount);
    // Emitted when the last lender lends (full amount now lent).
    event FullyFunded (uint256 lendingId);
    // Emitted when the review-time expired with insufficient funding.
    event InsufficientFunding (uint256 lendingId);
    // Emitted when asset is available to purchase
    event ForSale (uint256 lendingId);
    // Emitted when an asset is sold
    event Sold(address buyer, uint256 lendingId, uint256 amount);

    // Set the interest rate in the contract. Used in future lendings.
    // @Admin? TODO
    function setDailyInterestRate(uint256 _rate) external;

    // Get the "contract" current daily interest rate.
    function getDailyInterestRate() external returns (uint256);

    // Set the chunk size used for future lendings.
    // @Admin? TODO
    function setChunkSize(uint256) external;

    // borrow is called by a borrower to request an _amount collatoralised
    // against the token at _tokenContract.
    // If the item does not gain enough funding in _expirationTerm
    // then the asset is returned to the borrower.
    // If sufficient funding is gained, funds are sent
    // to the borrower.
    // The debt must be repaid by _debtTerm, which commences
    // when the funding reaches 100%
    function borrow(
        uint256 _amount,
        uint256 _expirationTerm,
        uint256 _debtTerm,
        uint256 _tokenId,
        address _tokenContract
    ) external;

    // lend is by a lender to provide ether to a pawn item _lendingId
    function lend(uint256 _lendingId) external payable;

    // statusUpdater is called by the platform to keep listings
    // up to date @Admin? TODO
    function statusUpdater() external;

    // statusUpdater is called by the platform to keep listings
    // up to date @Admin? TODO
    function singleStatusUpdater(uint256 _lendingid) external;

    // buy is called to purchase an asset which is for sale
    function buy(uint256 _lendingId) external payable;

    // pay is called by the lender to return the capital.
    // The value paid must be exactly to the amount owed.
    function pay(uint256 _lendingId) external payable;
}