import mongoose, { Document, Schema } from 'mongoose';

export interface IVerification extends Document {
  userId: string;
  providerId: mongoose.Types.ObjectId;
  contentIpfsHash: string;
  transactionHash: string;
  isHumanWritten: boolean;
  confidenceScore: number;
  nftTokenId: string;
  chain: string; // 'WORLD' or 'ROOTSTOCK'
  status: string; // 'PENDING', 'COMPLETED', 'FAILED'
  createdAt: Date;
  completedAt: Date;
}

const VerificationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
  contentIpfsHash: { type: String, required: true },
  transactionHash: { type: String },
  isHumanWritten: { type: Boolean },
  confidenceScore: { type: Number },
  nftTokenId: { type: String },
  chain: { type: String, enum: ['WORLD', 'ROOTSTOCK'], required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED'], 
    default: 'PENDING' 
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

export default mongoose.model<IVerification>('Verification', VerificationSchema); 