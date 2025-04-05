import mongoose, { Document, Schema } from 'mongoose';

export interface IProvider extends Document {
  name: string;
  description: string;
  apiEndpoint: string;
  apiKey: string;
  walletAddress: string;
  price: number;
  currency: string;  // WRD, USDC, BTC
  accuracyScore: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  apiEndpoint: { type: String, required: true },
  apiKey: { type: String, required: true },
  walletAddress: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true, enum: ['WRD', 'USDC', 'BTC'] },
  accuracyScore: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProvider>('Provider', ProviderSchema); 