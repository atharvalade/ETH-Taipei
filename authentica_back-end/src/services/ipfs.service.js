"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromIPFS = exports.uploadToIPFS = void 0;
const ipfs_http_client_1 = require("ipfs-http-client");
const config_1 = require("../config");
// Configure auth for Infura IPFS
const auth = 'Basic ' + Buffer.from(config_1.config.ipfsApiKey + ':' + config_1.config.ipfsApiSecret).toString('base64');
const client = (0, ipfs_http_client_1.create)({
    url: config_1.config.ipfsApiUrl,
    headers: {
        authorization: auth
    }
});
/**
 * Upload content to IPFS and return the hash
 */
const uploadToIPFS = (content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Add the content to IPFS
        const result = yield client.add(content);
        return result.path;
    }
    catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw new Error('Failed to upload content to IPFS');
    }
});
exports.uploadToIPFS = uploadToIPFS;
/**
 * Retrieve content from IPFS by hash
 */
const getFromIPFS = (ipfsHash) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        let content = '';
        // Stream the file content from IPFS
        const stream = client.cat(ipfsHash);
        try {
            for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _d = true) {
                _c = stream_1_1.value;
                _d = false;
                const chunk = _c;
                content += chunk.toString();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return content;
    }
    catch (error) {
        console.error('Error retrieving from IPFS:', error);
        throw new Error('Failed to retrieve content from IPFS');
    }
});
exports.getFromIPFS = getFromIPFS;
