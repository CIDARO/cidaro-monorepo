import Web3 from 'web3';

export namespace CidaroWeb3 {
    /**
     * Creates a new Web3 connection from a connection string.
     * @param connectionString connection string used for the web3 instance
     */
    export function fromConnectionString(connectionString?: string): Web3 {
        return new Web3(Web3.givenProvider || connectionString);
    }

    /**
     * Returns a Contract from a web3 instance, a contract ABI interface and its address.
     * @param web3 web3 instance
     * @param contractInterface contract ABI interface
     * @param contractAddress contract address
     * @param options options for the Contract creation
     */
    export async function getContract(web3: Web3, contractInterface: any, contractAddress: string, options?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const contract = new web3.eth.Contract(contractInterface, contractAddress, options)
                resolve(contract);
            } catch (err) {
                reject(err);
            }
        })
    }

    /**
     * Creates one or more wallet in-memory in the web3 instance.
     * @param web3 web3 instance
     * @param num number of wallets to create (default: 1)
     * @param entropy entropy string (default: None)
     */
    export async function createWallet(web3: Web3, num?: number, entropy?: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                web3.eth.accounts.wallet.create(num || 1, entropy);
                resolve(true);
            } catch (error) {
                reject(false);
            }
        })
    }

    export async function addWalletAddress(web3: Web3, account: any): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            try {
                web3.eth.accounts.wallet.add(account);
                resolve(true);
            } catch (error) {
                reject(false);
            }
        })
    }

    export async function removeWalletAddress(web3: Web3, account: any): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            try {
                web3.eth.accounts.wallet.remove(account);
                resolve(true);
            } catch (error) {
                reject(false);
            }
        })
    }

    export async function clearWallet(web3: Web3): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            try {
                web3.eth.accounts.wallet.clear();
                resolve(true);
            } catch (error) {
                reject(false);
            }
        })
    }
}