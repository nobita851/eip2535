const { ethers } = require('hardhat')
const dimaondAddress = "0x6d33f2774C3f4c0418E4Bf8eE10004D274604210";
const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')
async function add(){
    const diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', dimaondAddress);
    const FacetNames = [
    'Test1Facet'
  ]
  const cut = []
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName)
    const facet = await Facet.deploy()
    await facet.deployed()
    console.log(`${FacetName} deployed: ${facet.address}`)
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet)
    })
  }
  console.log("Cut: ", cut);
  tx = await diamondCutFacet.diamondCut(cut, ethers.constants.AddressZero, "0x")
  console.log('Diamond cut tx: ', tx.hash)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
}

add();