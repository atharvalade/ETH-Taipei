import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  username?: string;
  isWorldIdVerified: boolean;
  verificationCount: number;
  ipfsHashes: Array<{
    hash: string;
    hashKey: string;
    timestamp: Date;
    result?: {
      isHumanWritten: boolean;
      confidenceScore: number;
      provider: string;
      chain: string;
    };
    transactionHash?: string;
    nftTokenId?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, unique: true, index: true },
  username: { type: String },
  isWorldIdVerified: { type: Boolean, default: false },
  verificationCount: { type: Number, default: 0 },
  ipfsHashes: [{
    hash: { type: String, required: true },
    hashKey: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    result: {
      isHumanWritten: { type: Boolean },
      confidenceScore: { type: Number },
      provider: { type: String },
      chain: { type: String, enum: ['WORLD', 'ROOTSTOCK'] }
    },
    transactionHash: { type: String },
    nftTokenId: { type: String }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema); 