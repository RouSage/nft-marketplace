const { ethers } = require("ethers");

const NftMarket = artifacts.require("NftMarket");

contract("NftMarket", (accounts) => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther("0.3").toString();
  let _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    _contract = await NftMarket.deployed();
  });

  describe("Mint token", () => {
    const tokenURI = "https://test.com";

    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it("owner of the first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);

      assert.equal(
        owner,
        accounts[0],
        "Owner of token is not matching address[0]"
      );
    });

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);

      assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
    });

    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.mintToken(tokenURI, _nftPrice, {
          from: accounts[0],
        });
      } catch (error) {
        assert(error, "NFT was minted with previously used tokenURI");
      }
    });

    it("should have one listed item", async () => {
      const listedItemCount = await _contract.getListedItemsCount();

      assert.equal(
        listedItemCount.toNumber(),
        1,
        "Listed items count is not 1"
      );
    });

    it("should have create NFT item", async () => {
      const nftItem = await _contract.getNftItem(1);

      assert.equal(nftItem.tokenId, 1, "Token ID is not 1");
      assert.equal(nftItem.price, _nftPrice, "NFT price is not correct");
      assert.equal(nftItem.creator, accounts[0], "Creator is not account[0]");
      assert.equal(nftItem.isListed, true, "Token is not listed");
    });
  });

  describe("Buy NFT", () => {
    before(async () => {
      await _contract.buyNft(1, {
        from: accounts[1],
        value: _nftPrice,
      });
    });

    it("should unlist the item", async () => {
      const listedItem = await _contract.getNftItem(1);

      assert.equal(listedItem.isListed, false, "Item is still listed");
    });

    it("should decrease listed items count", async () => {
      const listedItemsCount = await _contract.getListedItemsCount();

      assert.equal(
        listedItemsCount.toNumber(),
        0,
        "Count has not been decremented"
      );
    });

    it("should change the owner", async () => {
      const currentOwner = await _contract.ownerOf(1);

      assert.equal(currentOwner, accounts[1], "Owner is not changed");
    });
  });

  describe("Token transfers", () => {
    const tokenURI = "https://test-2.com";

    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it("should have two NFTs created", async () => {
      const totalSupply = await _contract.totalSupply();

      assert.equal(
        totalSupply.toNumber(),
        2,
        "Total supply of tokens is not correct"
      );
    });

    it("should be able to retrieve NFT by index", async () => {
      const firstNft = await _contract.tokenByIndex(0);
      const secondNft = await _contract.tokenByIndex(1);

      assert.equal(firstNft.toNumber(), 1, "NFT id is wrong");
      assert.equal(secondNft.toNumber(), 2, "NFR id is wrong");
    });

    it("should have one listed NFT", async () => {
      const allNfts = await _contract.getAllNftsOnSale();

      assert.equal(allNfts[0].tokenId, 2, "NFT has a wrong tokenId");
    });

    it("account[1] should have one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({
        from: accounts[1],
      });

      assert.equal(ownedNfts[0].tokenId, 1, "NFT has a wrong tokenId");
    });

    it("account[0] should have one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({
        from: accounts[0],
      });

      assert.equal(ownedNfts[0].tokenId, 2, "NFT has a wrong tokenId");
    });
  });

  describe("Token transfer to new owner", () => {
    before(async () => {
      await _contract.transferFrom(accounts[0], accounts[1], 2);
    });

    it("account[0] should have 0 owned tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });

      assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
    });

    it("account[1] should have 2 owned tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });

      assert.equal(ownedNfts.length, 2, "Invalid length of tokens");
    });
  });

  describe("List NFT", () => {
    before(async () => {
      await _contract.placeNftOnSale(1, _nftPrice, {
        from: accounts[1],
        value: _listingPrice,
      });
    });

    it("should have 2 listed items", async () => {
      const listedNfts = await _contract.getAllNftsOnSale();
      const listedNftsCount = await _contract.getListedItemsCount();

      assert.equal(listedNfts.length, 2, "Invalid length of NFTs");
      assert.equal(listedNftsCount, 2, "Invalid length of NFTs");
    });

    it("should set new listing price", async () => {
      await _contract.setListingPrice(_listingPrice, { from: accounts[0] });
      const listingPrice = await _contract.listingPrice();

      assert.equal(listingPrice, _listingPrice, "Invalid listing price");
    });
  });

  //
  // UNUSED LOGIC
  //
  // describe("Burn token", () => {
  //   const tokenURI = "https://test-3.com";

  //   before(async () => {
  //     await _contract.mintToken(tokenURI, _nftPrice, {
  //       from: accounts[2],
  //       value: _listingPrice,
  //     });
  //   });

  //   it("account[2] should have 1 owned token", async () => {
  //     const ownedNfts = await _contract.getOwnedNfts({ from: accounts[2] });

  //     assert.equal(ownedNfts[0].tokenId, 3, "Nft has a wrong tokenId");
  //   });

  //   it("account[2] should have 0 owned tokens", async () => {
  //     await _contract.burnToken(3, { from: accounts[2] });
  //     const ownedNfts = await _contract.getOwnedNfts({ from: accounts[2] });

  //     assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
  //   });
  // });
});
