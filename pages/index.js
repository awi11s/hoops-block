import * as React from "react";
import Web3 from "web3";
import { Flex, Button, Spacer, Box } from '@chakra-ui/react';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";



const INITIAL_STATE = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null
};

function initWeb3(provider) {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };



  }

  componentDidMount() {
    this.web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    });

    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  onConnect = async () => {
    const provider = await this.web3Modal.connect();

    await this.subscribeProvider(provider);

    const web3 = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    await this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId
    });
    // await this.getAccountAssets();
  };

  subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts) => {
      await this.setState({ address: accounts[0] });
      // await this.getAccountAssets();
    });
    provider.on("chainChanged", async (chainId) => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      await this.setState({ chainId, networkId });
      // await this.getAccountAssets();
    });

    provider.on("networkChanged", async (networkId) => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
      // await this.getAccountAssets();
    });
  };


  getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.INFURA_ID,
        }
      }
 
    };
    return providerOptions;
  };

  // getAccountAssets = async () => {
  //   const { address, chainId } = this.state;
  //   this.setState({ fetching: true });
  //   try {
  //     // get account balances
  //     const assets = await apiGetAccountAssets(address, chainId);

  //     await this.setState({ fetching: false, assets });
  //   } catch (error) {
  //     console.error(error); // tslint:disable-line
  //     await this.setState({ fetching: false });
  //   }
  // };

  toggleModal = () =>
    this.setState({ showModal: !this.state.showModal });

  testSendTransaction = async () => {
    const { web3, address, chainId } = this.state;

    if (!web3) {
      return;
    }

    const tx = await formatTestTransaction(address, chainId);

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // @ts-ignore
      function sendTransaction(_tx) {
        return new Promise((resolve, reject) => {
          web3.eth
            .sendTransaction(_tx)
            .once("transactionHash", (txHash) => resolve(txHash))
            .catch((err) => reject(err));
        });
      }

      // send transaction
      const result = await sendTransaction(tx);

      // format displayed result
      const formattedResult = {
        action: ETH_SEND_TRANSACTION,
        txHash: result,
        from: address,
        to: address,
        value: "0 ETH"
      };

      // display result
      this.setState({
        web3,
        pendingRequest: false,
        result: formattedResult || null
      });
    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null });
    }
  };

  
  resetApp = async () => {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });
  };

  render = () => {
    const {
      assets,
      address,
      connected,
      chainId,
      fetching,
      showModal,
      pendingRequest,
      result
    } = this.state;
    return (
      <div>
        {connected ? 
            <Flex>
              <Box pg="4">
                connected 
              </Box>
              <Spacer />
              <Box pg="4" bg="green.400">
               ur connected 
              </Box>
            </Flex>
            :
            <Flex>
              <Button onClick={this.onConnect}>
                connect
              </Button>
              <Spacer />
              <Box pg="4" bg="red.400">
                not connected
              </Box>
            </Flex>
          }
         
      </div>
    );
  };
}

