declare function _exports(api: any): Blockchains;
export = _exports;
export type Block = {
    number: number;
    hash: string;
    size: number;
    gas_limit: number;
    gas_used: number;
    transaction_count: number;
    timestamp: number;
    Version: number;
    nonce: string;
};
export type Contract = {
    address: {
        hex: string;
        nonce: number;
        name?: string;
    };
    bytecode: string;
};
export type GetTokensResp = {
    list_cursor: {
        limit: number;
        has_more: boolean;
        self_uri: string;
        next_uri: string;
    };
    data: [
        {
            contract: {
                address: {
                    hex: string;
                    nonce: number;
                    name?: string;
                };
            };
        }
    ];
};
export type Balance = {
    token: {
        contract: {
            address: string;
        };
        symbol?: string;
        name?: string;
        decimals: number;
        total_supply: string;
        is_erc20: boolean;
    };
    address: string;
    balance: string;
};
export type GetBalancesResp = {
    data: [Balance] | number;
};
/**
  * @typedef Block
  * @property {Number} number
  * @property {String} hash
  * @property {Number} size
  * @property {Number} gas_limit
  * @property {Number} gas_used
  * @property {Number} transaction_count
  * @property {Number} timestamp
  * @property {Number} Version
  * @property {String} nonce
  *
  * @typedef Contract
  * @property {{
  *  hex: String,
  *  nonce: Number,
  *  name?: String
  * }} address
  * @property {String} bytecode
  *
  * @typedef GetTokensResp
  * @property {{
  *   limit: Number,
  *   has_more: Boolean,
  *   self_uri: String,
  *   next_uri: String
  * }} list_cursor
  * @property {[{
  *   contract: {
  *     address: {
  *       hex: String,
  *       nonce: Number,
  *       name?: String
  *     }
  *   }
  * }]} data
  *
  * @typedef {{
  *   token: {
  *     contract: {
  *       address: String
  *     },
  *     symbol?: String,
  *     name?: String,
  *     decimals: Number,
  *     total_supply: String,
  *     is_erc20: Boolean
  *   },
  *   address: String,
  *   balance: String
  * }} Balance
  * @typedef GetBalancesResp
  * @property {[Balance] | Number} data
 */
declare class Blockchains {
    constructor(api: any);
    api: any;
    /**
     * Fetches information regarding the requested block number.
     * If the endpoint is called without a block number, then the latest block Zabo has will be returned.
     * **NOTE:** Zabo lags the head of the blockchain by 10 blocks.
     * @param {'ethereum' | 'bitcoin' | {}} blockchain The blockchain name.
     * @param {Number} blockNumber Block number.
     * @returns {Promise<Block>}
     */
    getBlock(blockchain: 'ethereum' | 'bitcoin' | {}, blockNumber: number): Promise<Block>;
    /**
     * This function returns the address and bytecode for the contract at a given address.
     * The address is required, and there must a smart contract deployed at the given address.
     * @param {('ethereum' | {})} blockchain The blockchain name.
     * @param {String} address The address for the contract.
     * @returns {Promise<Contract>}
     */
    getContract(blockchain: ('ethereum' | {}), address: string): Promise<Contract>;
    /**
     * This function returns a list of tokens on the Ethereum blockchain in general,
     * or a specific token if the name is provided.
     * Names are not unique so, if a name is provided in the path, a list is still
     * returned for all tokens that share the same name.
     * **NOTE:** The name is case-sensitive!
     * @param {'ethereum' | {}} blockchain The blockchain name.
     * @param {String} tokenName The name of the token.
     * @returns {Promise<GetTokensResp>}
     */
    getTokens(blockchain: 'ethereum' | {}, tokenName: string): Promise<GetTokensResp>;
    /**
     * This function returns a list of balances of the assets which the given address
     * or extended public key holds. If the response is for a Bitcoin network request,
     * then the data response is simply the address', or xpub key's, balance in satoshis.
     * @param {'ethereum' | 'bitcoin' | {}} blockchain The blockchain name.
     * @param {String} address The blockchain address.
     * @returns {Promise<GetBalancesResp>}
     */
    getBalances(blockchain: 'ethereum' | 'bitcoin' | {}, address: string): Promise<GetBalancesResp>;
    getTransactions(blockchain: any, address: any): Promise<any>;
    getTransaction(blockchain: any, transactionHash: any): Promise<any>;
    getTokenTransfers(blockchain: any, address: any): Promise<any>;
    getTokenTransfer(blockchain: any, transactionHash: any): Promise<any>;
}
