// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GoldToken is ERC20, ERC20Burnable, Ownable {
    uint256 public sellPrice; // in wei per GLD
    uint256 public buyPrice;  // in wei per GLD
    address payable public sellerWallet;

    event GoldPurchased(address indexed buyer, uint256 amount);
    event GoldSold(address indexed seller, uint256 amount);
    event PricesUpdated(uint256 sellPrice, uint256 buyPrice);
    event GoldRedeemed(address indexed user, uint256 amount, uint256 timestamp);
    event GLDMinted(address indexed to, uint256 amount);

    constructor(
        address payable _sellerWallet,
        uint256 _initialSellPrice,
        uint256 _initialBuyPrice,
        address initialOwner
    ) ERC20("Gold Token", "GLD") Ownable(initialOwner) {
        require(_sellerWallet != address(0), "Invalid seller wallet");
        require(_initialBuyPrice < _initialSellPrice, "Buy price must be less than sell price");

        sellerWallet = _sellerWallet;
        sellPrice = _initialSellPrice;
        buyPrice = _initialBuyPrice;

        // Mint initial inventory to the contract
        _mint(address(this), 1_000_000 * 10 ** decimals());
    }

    // -----------------------
    // Public / User Functions
    // -----------------------

    function buyGold() public payable {
        require(msg.value >= sellPrice, "ETH sent is too low");

        uint256 gldToSend = (msg.value * (10 ** decimals())) / sellPrice;
        uint256 requiredETH = (gldToSend * sellPrice) / (10 ** decimals());
        uint256 refund = msg.value - requiredETH;

        require(balanceOf(address(this)) >= gldToSend, "Insufficient GLD in contract");

        uint256 profit = ((sellPrice - buyPrice) * gldToSend) / (10 ** decimals());
        sellerWallet.transfer(profit);

        _transfer(address(this), msg.sender, gldToSend);

        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }

        emit GoldPurchased(msg.sender, gldToSend);
    }

    function sellGold(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Not enough GLD");
        uint256 ethToSend = (buyPrice * amount) / (10 ** decimals());
        require(address(this).balance >= ethToSend, "Insufficient ETH in contract");

        _transfer(msg.sender, address(this), amount);
        payable(msg.sender).transfer(ethToSend);

        emit GoldSold(msg.sender, amount);
    }

    function approveGLD(address spender, uint256 amount) public returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    // -----------------------
    // Owner / Admin Functions
    // -----------------------

    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) public onlyOwner {
        require(newBuyPrice < newSellPrice, "Buy price must be lower than sell price");
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
        emit PricesUpdated(newSellPrice, newBuyPrice);
    }

    function mintGLD(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Invalid address");
        _mint(to, amount);
        emit GLDMinted(to, amount);
    }

    function redeemGoldFrom(address user, uint256 amount) public onlyOwner {
        require(user != address(0), "Invalid user address");
        burnFrom(user, amount);
        emit GoldRedeemed(user, amount, block.timestamp);
    }

    // ------------------------
    // Utility / View Functions
    // ------------------------

    function getPrices() public view returns (uint256, uint256) {
        return (sellPrice, buyPrice);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getGLDInventory() public view returns (uint256) {
        return balanceOf(address(this));
    }

    function getCirculatingSupply() public view returns (uint256) {
        return totalSupply() - balanceOf(address(this));
    }

    function isFullyBacked() public view returns (bool) {
        uint256 circulating = getCirculatingSupply();
        uint256 requiredETH = (circulating * buyPrice) / (10 ** decimals());
        return address(this).balance >= requiredETH;
    }
}
