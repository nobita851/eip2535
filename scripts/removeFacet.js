const { ethers } = require('hardhat')
const dimaondAddress = "0x6d33f2774C3f4c0418E4Bf8eE10004D274604210";
const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')
async function remove(){
    const diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', dimaondAddress);
    const FacetNames = [
    'DiamondLoupeFacet',
    'OwnershipFacet'
  ]
  const cut = []
  for (const FacetName of FacetNames) {
    facet =  await ethers.getContractAt(FacetName, dimaondAddress)
    cut.push({
      facetAddress: ethers.constants.AddressZero,
      action: FacetCutAction.Remove,
      functionSelectors: getSelectors(facet)
    })
  }

  tx = await diamondCutFacet.diamondCut(cut, ethers.constants.AddressZero, "0x")
  console.log('Diamond cut tx: ', tx.hash)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
}

remove();