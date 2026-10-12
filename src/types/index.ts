export interface Plan {
  id: string;
  name: string;
  price: number;
  durationText: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
}

export interface Membership {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  planId: string;
  planName: string;
  months: number;
  monthlyPrice: number;
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  paymentMethod: 'esewa' | 'khalti' | 'counter' | 'simulated';
  transactionUuid: string;
  paymentRef?: string;
  paymentDate?: string;
  membershipStartDate: string;
  membershipEndDate: string;
  termsAccepted: boolean;
  notes?: string;
  createdAt: string;
}

export interface Trainer {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  certifications: string[];
  imageUrl: string;
  schedule: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  program?: string;
  createdAt: string;
}

export interface EsewaPayload {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
  esewaUrl: string;
}
