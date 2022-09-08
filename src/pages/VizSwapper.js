import React, { useState, useEffect } from "react";
import ChainVisualizer from "../components/ChainVisualizer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Network, Alchemy } from "alchemy-sdk";

const VizSwapper = () => {
	const [data, setData] = useState();
	const [contractAddress, setContractAddress] = useState("0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"); // Punx
	const [walletsToLoad, setWalletsToLoad] = useState(10);
	const [subNftsToLoad, setSubNftsToLoad] = useState(3);

	useEffect(() => {
		const firstQuery = async () => {
			await loadData();
		};
		firstQuery();
	}, []);

	const settings = {
		apiKey: "IVkEPv79eQuAyvyy7lsfu0RXUsD9nFoC", // Replace with your Alchemy API Key.
		network: Network.ETH_MAINNET, // Replace with your network.
	};

	const loadData = async () => {
		const nodeData = {
			nodes: [],
			links: [],
		};
		const mainNode = {
			id: contractAddress,
		};
		nodeData.nodes.push(mainNode);

		const alchemy = new Alchemy(settings);

		// get the first batch of owned NFTs
		const nfts = await alchemy.nft.getOwnersForContract(contractAddress);
		for (let i = 0; i < walletsToLoad; i++) {
			const newNode = {
				id: nfts.owners[i],
			};
			const newLink = {
				source: contractAddress,
				target: nfts.owners[i],
			};
			nodeData.nodes.push(newNode);
			nodeData.links.push(newLink);

			try {
				const nftsOwnedByWallet = await alchemy.nft.getNftsForOwner(nfts.owners[i]);
				let nftOwnedCount = nftsOwnedByWallet.ownedNfts.length;
				if (nftOwnedCount > subNftsToLoad) nftOwnedCount = subNftsToLoad;
				for (let j = 0; j <= nftOwnedCount; j++) {
					const ownedNft = {
						id: nftsOwnedByWallet.ownedNfts[j].contract.address,
					};
					const ownedLink = {
						source: nfts.owners[i],
						target: nftsOwnedByWallet.ownedNfts[j].contract.address,
					};

					if (!containsNode(nodeData, ownedNft.id)) nodeData.nodes.push(ownedNft);

					nodeData.links.push(ownedLink);
				}
			} catch {}
		}

		console.log("setting state");
		setData(nodeData);
	};

	const containsNode = (nodeData, addressToCheck) => {
		const nodes = nodeData.nodes;
		if (!nodes) return false;
		addressToCheck = addressToCheck.toLowerCase();

		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].id.toLowerCase() === addressToCheck) {
				console.log("contains node");
				return true;
			}
		}

		return false;
	};

	return (
		<div className="flex flex-col h-screen w-100% bg-background">
			<div className="flex justify-end bg-pink pb-3 pt-3 pr-3 ">
				<ConnectButton showBalance={false} />
			</div>

			<div className="flex flex-row items-end grow-0 border-2 pl-3 pr-3 border-orange">
				<div className="flex flex-col pt-3 pl-3 pr-3 pt-40 w-[50%] h-[100%]">
					<label
						className="bg-orange block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 w-[50%]"
						for="grid-first-name"
					>
						Wallets To Load
					</label>
					<input
						className="appearance-none block w-[50%] rounded py-3 px-4 mb-3"
						type="text"
						name="walletsToLoad"
						value={walletsToLoad}
						onChange={(e) => {
							setWalletsToLoad(e.target.value);
						}}
					/>
					<label
						className="bg-orange block w-[50%] uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 w-[50%]"
						for="grid-first-name"
					>
						Sub NFTs to Load
					</label>
					<input
						className="appearance-none block w-[50%] rounded py-3 px-4 mb-3"
						type="text"
						name="walletsToLoad"
						value={subNftsToLoad}
						onChange={(e) => {
							setSubNftsToLoad(e.target.value);
						}}
					/>
					<label
						className="bg-orange block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 w-[50%]"
						for="grid-first-name"
					>
						Contract Address
					</label>
					<input
						className="appearance-none block w-[90%] rounded py-3 px-4 mb-3"
						type="text"
						name="contractAddress"
						value={contractAddress}
						onChange={(e) => {
							setContractAddress(e.target.value);
						}}
					/>
					<button
						onClick={loadData}
						className="bg-pink w-[50%] hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
					>
						generate
					</button>
				</div>
				<ChainVisualizer data={data} />
			</div>
		</div>
	);
};

export default VizSwapper;
