import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import VizSwapper from "./pages/VizSwapper";

const { chains, provider } = configureChains(
	[chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
	[alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()],
);
const { connectors } = getDefaultWallets({
	appName: "Chain Visualizer",
	chains,
});
const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

const App = () => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider theme={darkTheme()} chains={chains}>
				<VizSwapper />
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default App;
