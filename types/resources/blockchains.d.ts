declare const _exports: (api: any) => BlockchainsAPI;
export = _exports;
export type ListCursor = {
    limit: number;
    has_more: boolean;
    self_uri: string;
    next_uri: string;
};
export type Address = {
    hex: string;
    nonce?: number;
    name?: string;
};
export type Token = {
    contract: {
        address: string;
    };
    symbol?: string;
    name?: string;
    decimals: number;
    total_supply: string;
    is_erc20: boolean;
};
export type Block = {
    number?: number;
    hash?: string;
    size?: number;
    gas_limit?: number;
    gas_used?: number;
    transaction_count?: number;
    timestamp?: number;
    version?: number;
    nonce?: string;
};
export type Contract = {
    address?: Address;
    bytecode?: string;
};
export type GetTokensResp = {
    list_cursor?: ListCursor;
    data?: [
        {
            contract?: {
                address?: Address;
            };
        }
    ];
};
export type TokenBalance = {
    token?: Token;
    address?: string;
    balance?: string;
};
export type GetBalancesResp = {
    data?: [TokenBalance] | number;
};
export type ETHTransaction = {
    hash?: string;
    block_number?: number;
    from_address?: Address;
    to_address?: Address;
    value?: string;
    gas?: number;
    gas_price?: string;
    gas_used?: number;
    input?: string;
    status?: number;
};
export type BTCNode = {
    node: {
        output_script?: string;
        output_script_type?: string;
        addresses?: [
            {
                address?: Address;
                index?: number;
            }
        ];
        input_script?: string;
        input_sequence?: string;
        required_signatures?: number;
        output_value?: number;
    };
    output_transaction?: {
        hash?: string;
        block_number?: number;
        outputs?: any;
        inputs?: any;
        size?: number;
        lock_time?: number;
        is_coinbase?: boolean;
    };
    output_index?: number;
    input_transaction?: any;
    input_index?: any;
};
export type BTCTransaction = {
    outputs?: [BTCNode];
    inputs?: [BTCNode];
};
export type TransactionData = ETHTransaction & BTCTransaction;
export type GetTransactionsResp = {
    list_cursor?: ListCursor;
    data?: [TransactionData];
};
export type GetTransactionResp = {
    data?: TransactionData;
};
export type GetTokenTransfersResp = {
    list_cursor?: ListCursor;
    data?: [
        {
            transaction: ETHTransaction;
            token: Token;
            from_address: Address;
            to_address: Address;
            value: string;
        }
    ];
};
export type GetTokenTransferResp = {
    data?: [
        {
            transaction: ETHTransaction;
            token: Token;
            from_address: Address;
            to_address: Address;
            value: string;
        }
    ];
};
export type BlockchainsAPI = Blockchains;
/**
 * @typedef {{
 *   limit: Number
 *   has_more: Boolean
 *   self_uri: String
 *   next_uri: String
 * }} ListCursor
 *
 * @typedef {{
 *  hex: String
 *  nonce?: Number
 *  name?: String
 * }} Address
 *
 * @typedef {{
 *  contract: {
 *    address: String
 *  },
 *  symbol?: String
 *  name?: String
 *  decimals: Number
 *  total_supply: String
 *  is_erc20: Boolean
 * }} Token
 *
 * @typedef {{
 *  number?: Number
 *  hash?: String
 *  size?: Number
 *  gas_limit?: Number
 *  gas_used?: Number
 *  transaction_count?: Number
 *  timestamp?: Number
 *  version?: Number
 *  nonce?: String
 * }} Block
 *
 * @typedef {{
 *  address?: Address
 *  bytecode?: String
 * }} Contract
 *
 * @typedef {{
 *  list_cursor?: ListCursor
 *  data?: [{
 *    contract?: {
 *      address?: Address
 *    }
 *  }]
 * }} GetTokensResp
 *
 * @typedef {{
 *   token?: Token,
 *   address?: String,
 *   balance?: String
 * }} TokenBalance
 *
 * @typedef {{
 *  data?: [TokenBalance] | Number
 * }} GetBalancesResp
 *
 * @typedef {{
 *  hash?: String
 *  block_number?: Number
 *  from_address?: Address
 *  to_address?: Address
 *  value?: String
 *  gas?: Number
 *  gas_price?: String
 *  gas_used?: Number
 *  input?: String
 *  status?: Number
 * }} ETHTransaction
 *
 * @typedef {{
 *  node: {
 *    output_script?: String
 *    output_script_type?: String
 *    addresses?: [{
 *      address?: Address
 *      index?: Number
 *    }],
 *    input_script?: String
 *    input_sequence?: String
 *    required_signatures?: Number
 *    output_value?: Number
 *  },
 *  output_transaction?: {
 *    hash?: String
 *    block_number?: Number
 *    outputs?: any
 *    inputs?: any
 *    size?: Number
 *    lock_time?: Number
 *    is_coinbase?: Boolean
 *  },
 *  output_index?: Number
 *  input_transaction?: any
 *  input_index?: any
 * }} BTCNode
 *
 * @typedef {{
 *  outputs?: [BTCNode]
 *  inputs?: [BTCNode]
 * }} BTCTransaction
 *
 * @typedef {ETHTransaction & BTCTransaction} TransactionData
 *
 * @typedef {{
 *  list_cursor?: ListCursor
 *  data?: [TransactionData]
 * }} GetTransactionsResp
 *
 * @typedef {{
 *  data?: TransactionData
 * }} GetTransactionResp
 *
 * @typedef {{
 *  list_cursor?: ListCursor
 *  data?: [{
 *    transaction: ETHTransaction,
 *    token: Token,
 *    from_address: Address,
 *    to_address: Address,
 *    value: String
 *  }]
 * }} GetTokenTransfersResp
 *
 * @typedef {{
 *  data?: [{
 *    transaction: ETHTransaction,
 *    token: Token,
 *    from_address: Address,
 *    to_address: Address,
 *    value: String
 *  }]
 * }} GetTokenTransferResp
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
     * @returns {Promise<Block>} API response.
     */
    getBlock(blockchain: 'ethereum' | 'bitcoin' | {}, blockNumber: number): Promise<Block>;
    /**
     * This function returns the address and bytecode for the contract at a given address.
     * The address is required, and there must a smart contract deployed at the given address.
     * @param {('ethereum' | {})} blockchain The blockchain name.
     * @param {String} address The address for the contract.
     * @returns {Promise<Contract>} API response.
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
     * @returns {Promise<GetTokensResp>} API response.
     */
    getTokens(blockchain: 'ethereum' | {}, tokenName: string): Promise<GetTokensResp>;
    /**
     * This function returns a list of balances of the assets which the given address
     * or extended public key holds. If the response is for a Bitcoin network request,
     * then the data response is simply the address', or xpub key's, balance in satoshis.
     * @param {'ethereum' | 'bitcoin' | {}} blockchain The blockchain name.
     * @param {String} address The blockchain address.
     * @returns {Promise<GetBalancesResp>} API response.
     */
    getBalances(blockchain: 'ethereum' | 'bitcoin' | {}, address: string): Promise<GetBalancesResp>;
    /**
     * This function returns a list of transactions executed by the given address or extended public key.
     * @param {'ethereum' | 'bitcoin' | {}} blockchain The blockchain name.
     * @param {String} address The blockchain address.
     * @returns {Promise<GetTransactionsResp>} API response.
     */
    getTransactions(blockchain: 'ethereum' | 'bitcoin' | {}, address: string): Promise<GetTransactionsResp>;
    /**
     * This function returns a single transaction object related to the hash included in the request.
     * @param {'ethereum' | 'bitcoin' | {}} blockchain The blockchain name.
     * @param {String} transactionHash The transaction hash.
     * @returns {Promise<GetTransactionResp>} API response.
     */
    getTransaction(blockchain: 'ethereum' | 'bitcoin' | {}, transactionHash: string): Promise<GetTransactionResp>;
    /**
     * This function returns a list of token transfers directly involving the given address or extended public key.
     * @param {'ethereum' | {}} blockchain The blockchain name.
     * @param {String} address The blockchain address.
     * @returns {Promise<GetTokenTransfersResp>} API response.
     */
    getTokenTransfers(blockchain: 'ethereum' | {}, address: string): Promise<GetTokenTransfersResp>;
    /**
     * This function returns the token transfers which executed as a result of the given transaction hash.
     * @param {'ethereum' | {}} blockchain The blockchain name.
     * @param {String} transactionHash The transaction hash.
     * @returns {Promise<GetTokenTransferResp>} API response.
     */
    getTokenTransfer(blockchain: 'ethereum' | {}, transactionHash: string): Promise<GetTokenTransferResp>;
}
