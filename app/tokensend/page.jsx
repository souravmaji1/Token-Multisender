'use client'
import React, { useState } from 'react';
import { FaLocationArrow } from "react-icons/fa6";
import { navItems } from "@/data";
import MagicButton from "@/components/MagicButton";
import { Spotlight } from "@/components/ui/Spotlight";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { ethers } from 'ethers';



const TokenBulkSender = () => {
    const [selectedToken, setSelectedToken] = useState(null);
    const [network, setNetwork] = useState(null);
    const [recipientAddresses, setRecipientAddresses] = useState('');
    const [acknowledgeTerms, setAcknowledgeTerms] = useState(false);
    const [status, setStatus] = useState('Not Connected');
    const [account, setAccount] = useState('');
    const [tokencontract, setTokenContract] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                handleAccountsChanged(accounts);
                window.ethereum.on('accountsChanged', handleAccountsChanged);
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };



    const disconnectWallet = () => {
        setAccount('');
        setStatus('Not Connected');
    };

    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            console.log('Please connect to MetaMask.');
            disconnectWallet();
        } else {
            setAccount(accounts[0]);
            setStatus('Connected');
        }
    };

    const handleTokenSelect = (tokenType) => {
        setSelectedToken(tokenType);
    };

    const handleNetworkSelect = (networkType) => {
        setNetwork(networkType);
    };

    const handleRecipientsChange = (value) => {
        setRecipientAddresses(value);
    };

    const handleTermsAcknowledgement = () => {
        setAcknowledgeTerms(!acknowledgeTerms);
    };

    const calculateTotalAmount = () => {
        const inputLines = recipientAddresses.split('\n');
        const totalAmount = inputLines.reduce((total, line) => {
            const [address, amount] = line.split('-');
            return total + (parseFloat(amount) || 0);
        }, 0);
        return totalAmount;
    };

    const getTokenDecimals = async (tokenContractAddress) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tokenAbi = [
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ];

        const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, provider);
        const decimals = await tokenContract.decimals();
        return decimals;
    };

    

    const approveToken = async (address,totalamount) => {
        try {
            // Provider setup
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const nftabi = [
                {
                    "type": "function",
                    "name": "approve",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "spender",
                            "internalType": "address"
                        },
                        {
                            "type": "uint256",
                            "name": "amount",
                            "internalType": "uint256"
                        }
                    ],
                    "outputs": [
                        {
                            "type": "bool",
                            "name": "",
                            "internalType": "bool"
                        }
                    ],
                    "stateMutability": "nonpayable"
                }
            ];

            const usdccontract = address;

            // Contract instance for the ERC20 or ERC721 token
            const tokenContract = new ethers.Contract(usdccontract, nftabi, signer);

            const loanContractAddress = "0x843199eC87cA6574D8e7a4CFc8029d44D5E39dF8";

            

            // Call the approve function on the token contract
            const approveTx = await tokenContract.approve(loanContractAddress, totalamount);

            console.log("Approval transaction:", approveTx);

            // Wait for transaction confirmation
            await approveTx.wait();

            console.log("Token approval successful!");
        } catch (error) {
            console.error("Error approving token:", error);
        }
    };

    const AirdropTokens = async (tokenContractAddress) => {
        try {
            // Deploy the compiled contract using MetaMask
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contractAddress = "0x843199eC87cA6574D8e7a4CFc8029d44D5E39dF8";
            const abi = [
                {
                    "type": "function",
                    "name": "airdrop",
                    "inputs": [
                        {
                            "type": "address",
                            "name": "token",
                            "internalType": "address"
                        },
                        {
                            "type": "address[]",
                            "name": "recipients",
                            "internalType": "address[]"
                        },
                        {
                            "type": "uint256[]",
                            "name": "amounts",
                            "internalType": "uint256[]"
                        }
                    ],
                    "outputs": [],
                    "stateMutability": "nonpayable"
                }
            ];

            // Create a contract instance
            const contract = new ethers.Contract(contractAddress, abi, signer);

            // Get token decimals
            const decimals = await getTokenDecimals(tokenContractAddress);

            const inputLines = recipientAddresses.split('\n');
            const invalidLines = inputLines.filter(line => !line.match(/^0x[0-9a-fA-F]{40}(-\d+(\.\d+)?)?$/));

            if (invalidLines.length > 0) {
                throw new Error(`Invalid input format in the following lines:\n${invalidLines.join('\n')}`);
            }

            const recipientAddressesArray = [];
            const amountsArray = [];

            inputLines.forEach(line => {
                const [address, amount] = line.split('-');
                if (address && amount) {
                    recipientAddressesArray.push(address.trim());
                    amountsArray.push(ethers.utils.parseUnits(amount.trim(), decimals));
                }
            });

            const totalAmount = amountsArray.reduce((acc, amount) => acc.add(amount), ethers.BigNumber.from(0));

            await approveToken(tokenContractAddress, totalAmount);

            const call = await contract.airdrop(tokenContractAddress, recipientAddressesArray, amountsArray);

            console.log(call);

        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            <FloatingNav navItems={navItems} />
            <main className="relative flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5 py-5 pt-36">
              
            <div className="max-w-7xl w-full">

               

                <Spotlight
                    className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
                    fill="white"
                />
                <Spotlight
                    className="h-[80vh] w-[50vw] top-10 left-full"
                    fill="purple"
                />
                <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />

               

        <div className=" text-white p-8 flex flex-col md:flex-row">
            <style>
                {`
          .token-button {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid gray;
            padding: 10px 20px;
            border-radius: 8px;
            margin-right: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .token-button.selected {
            border-color: #007bff;
            box-shadow: 0 0 15px rgba(0, 123, 255, 0.5);
          }
         .network-button {
         display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid gray;
            padding: 10px 20px;
            border-radius: 8px;
            margin-right: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
         }
            .network-button.selected {
             border-color: #64fba1;
             box-shadow: 0 0 15px rgba(0, 123, 255, 0.5);
            }
             .network-button:hover {
             border-color: #64fba1;
            box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
             }
          .token-button:hover {
            border-color: #007bff;
            box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
          }
        `}
            </style>
            <div className="w-full md:w-2/3 mr-8">
                


                            <div className="flex items-baseline" style={{gap:"80px"}}>
                                <h1 className=" font-bold mb-4" style={{ fontSize: '30px' }}>Token Bulk Sender</h1>
                                <button
                                    style={{ background: "rgba(17,25,40,0.75)", padding: "8px",height:'8vh',borderRadius:'5px',width:"22%"}}
                                    className="airdrop-button"
                                    onClick={connectWallet}
                                >
                                    {status === 'Connected' ? 'Connected' : 'Connect Wallet'}
                                </button>
                               
                            </div>
                           




                <div className="mb-4" style={{ marginTop: '50px' }}>
                    <p className="mb-2">What type of asset are you transferring?</p>
                    <div className="flex">
                        <button
                            className={`token-button ${selectedToken === 'erc20' ? 'selected' : ''}`}
                            onClick={() => handleTokenSelect('erc20')}
                            style={{ padding: '30px', borderRadius: '20px' }}
                        >
                            <span className="flex items-center">
                                <span className="mr-2">🌞</span>
                                Fungible Token (ERC-20)
                            </span>
                        </button>
                        <button
                            className={`token-button ${selectedToken === 'erc1155' ? 'selected' : ''}`}
                            onClick={() => handleTokenSelect('erc1155')}
                            style={{ padding: '30px', borderRadius: '20px' }}
                        >
                            <span className="flex items-center">
                                <span className="mr-2">🤖</span>
                                NFT (ERC-1155)
                            </span>
                        </button>
                    </div>
                </div>
                <div className="mb-4" style={{ marginTop: '50px' }}>
                    <p className="mb-2">Based on which network?</p>
                    <div className="flex flex-wrap">
                        {[
                            { name: 'Arbitrum', icon: '⚛️' },
                            { name: 'Avalanche', icon: '🌊' },
                            { name: 'Base', icon: '🔵' },
                            { name: 'Blast', icon: '💥' },
                            { name: 'BNBChain', icon: '💰' },
                            { name: 'Cyber', icon: '🌐' },
                            { name: 'Degen', icon: '👾' },
                            { name: 'Flare', icon: '🔥' },
                            { name: 'Klaytn', icon: '🔺' },
                            { name: 'Ethereum', icon: '🔷' },
                            { name: 'Optimism', icon: '🔴' },
                            { name: 'Polygon', icon: '💜' },
                            { name: 'Zora', icon: '⭕️' },
                            { name: 'Sepolia', icon: '🌀' },
                        ].map(({ name, icon }) => (
                            <button
                                key={name}
                                className={`network-button ${network === name ? 'selected' : ''}`}
                                onClick={() => handleNetworkSelect(name)}
                            >
                                <span className="flex items-center">
                                    <span className="mr-2">{icon}</span>
                                    {name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '50px' }}>
                    <p>Choose a token to transfer</p>
                    <input
                        type="text"
                        value={selectedToken}
                        onChange={(e) => handleTokenSelect(e.target.value)}
                        placeholder="Enter token address or symbol"
                        className="text-white px-4 py-2 rounded w-full"
                        style={{ borderBottom: '2px solid rgba(100,251,161,1)', background: 'none',width:'80%' }}
                    />
                </div>

                            <div style={{ marginTop: '50px' }}>
                                <p>Enter Your Token Contract Address</p>
                                <input
                                    type="text"
                                    value={tokencontract}
                                    onChange={(e) => setTokenContract(e.target.value)}
                                    placeholder="Enter erc20 contract address"
                                    className="text-white px-4 py-2 rounded w-full"
                                    style={{ borderBottom: '2px solid rgba(100,251,161,1)', background: 'none', width: '80%' }}
                                />
                            </div>

                <div className="mb-4" style={{ marginTop: '60px' }}>
                    <p>Recipient Addresses</p>
                    <p className="mb-2" style={{width:"80%"}}>
                        Please enter the bulk sender data in the address-amount format. Each
                        address and amount should be on a new line.
                    </p>
                    <textarea
                        value={recipientAddresses}
                        onChange={(e) => setRecipientAddresses(e.target.value)}
                        placeholder="eg: 0xeac1C7b759B9ccd0f9056dE28EF493156bd53D3A-5"
                        className="text-white px-4 py-2 rounded w-full h-40"
                        style={{ border: '2px solid rgba(100,251,161,1)', background: 'none', borderRadius: '20px',width:'80%' }}
                    />
                </div>

                <div className="mb-4">
                    <p>
                        Send tokens to{' '}
                        {recipientAddresses
                            .split('\n')
                            .filter((line) => line.trim().length > 0).length}{' '}
                        addresses
                    </p>
                    <p>
                        Total amount: {calculateTotalAmount()} (
                        {selectedToken || 'select token first'})
                    </p>
                </div>

                <div className="mb-4 flow items-center" style={{ marginTop: '60px',width:'80%' }}>
                    <input
                        type="checkbox"
                        checked={acknowledgeTerms}
                        onChange={handleTermsAcknowledgement}
                        className="mr-2"
                    />
                    <p>
                        I acknowledge that this bulk send transaction is non-cancelable, and
                        the associated gas fee is non-refundable.
                    </p>
                </div>

                <button
                                className="text-white px-4 py-2 rounded"
                                style={{ background: "rgba(100,251,161,1)", boxShadow: "0 0 15px rgba(0, 123, 255, 0.5)",fontWeight:'500'}}
                                onClick={() => AirdropTokens(tokencontract)}
                    disabled={!selectedToken || !recipientAddresses || !acknowledgeTerms}
                >
                    Send Airdrop
                </button>
            </div>

            <div className=" md:w-1/3 p-4 rounded-lg" style={{ background: "rgba(17,25,40,0.75)", border: '2px solid rgba(255,255,255,0.125)',width:"50%",height:'42vh' }} >
                <p className="mb-2">Airdrop Preview</p>
               
                            <div className="flex flex-col space-y-2 mt-6">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">Token Contract Address:</span>
                                    <span className="text-green-400">{tokencontract.slice(0, 6)}...{tokencontract.slice(-4)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">Total Recipient Addresses:</span>
                                    <span className="text-purple-400">{recipientAddresses.split('\n').filter(Boolean).length}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">Total Amount of Tokens:</span>
                                    <span className="text-blue-400">{calculateTotalAmount()}</span>
                                </div>
                            </div>
            </div>
        </div>

        </div>
        </main>
        </>
    );
};

export default TokenBulkSender;
