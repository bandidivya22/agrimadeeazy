import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, CheckCircle, Lock, Smartphone, QrCode, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';

interface FormData {
  name: string;
  email: string;
  phone: string;
  houseFlat: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  paymentMethod: 'UPI' | 'COD' | '';
  utrNumber: string;
  acceptTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  houseFlat?: string;
  street?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  paymentMethod?: string;
  utrNumber?: string;
  acceptTerms?: string;
}

const MERCHANT_UPI_ID = 'agrimadeeazy@upi';
const MERCHANT_NAME = 'AgriMadeEazy';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const errorRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [form, setForm] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    houseFlat: '',
    street: '',
    city: user?.city || '',
    district: '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    paymentMethod: '',
    utrNumber: '',
    acceptTerms: false,
  });

  const upiLink = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total.toFixed(2)}&cu=INR&tn=AgriMadeEazy Order`;

  const validateField = (name: string, value: string | boolean): string | undefined => {
    switch (name) {
      case 'name':
        if (!value || !String(value).trim()) return 'Full Name is required.';
        if (String(value).trim().length < 2) return 'Name must be at least 2 characters.';
        return undefined;
      case 'email':
        if (!value || !String(value).trim()) return 'Email Address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) return 'Please enter a valid email address.';
        return undefined;
      case 'phone':
        if (!value || !String(value).trim()) return 'Phone number is required.';
        if (!/^[6-9]\d{9}$/.test(String(value).replace(/\s/g, ''))) return 'Please enter a valid 10-digit phone number.';
        return undefined;
      case 'houseFlat':
        if (!value || !String(value).trim()) return 'House/Flat Number is required.';
        return undefined;
      case 'street':
        if (!value || !String(value).trim()) return 'Street Address is required.';
        return undefined;
      case 'city':
        if (!value || !String(value).trim()) return 'Village/City is required.';
        return undefined;
      case 'district':
        if (!value || !String(value).trim()) return 'District is required.';
        return undefined;
      case 'state':
        if (!value || !String(value).trim()) return 'State is required.';
        return undefined;
      case 'pincode':
        if (!value || !String(value).trim()) return 'Pincode is required.';
        if (!/^\d{6}$/.test(String(value).trim())) return 'Pincode must contain exactly 6 digits.';
        return undefined;
      case 'paymentMethod':
        if (!value) return 'Please select a payment method.';
        return undefined;
      case 'utrNumber':
        if (form.paymentMethod === 'UPI') {
          if (!value || !String(value).trim()) return 'UPI Transaction ID is required for UPI payments.';
          if (String(value).trim().length < 8) return 'Please enter a valid UTR number.';
        }
        return undefined;
      case 'acceptTerms':
        if (!value) return 'You must accept the terms to place an order.';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (name: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name] || errors[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, form[name] as string | boolean);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateStep = (stepName: 'address' | 'payment'): boolean => {
    const newErrors: FormErrors = {};
    const fieldsToValidate: (keyof FormData)[] =
      stepName === 'address'
        ? ['name', 'email', 'phone', 'houseFlat', 'street', 'city', 'district', 'state', 'pincode']
        : ['paymentMethod', 'utrNumber'];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, form[field] as string | boolean);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched((prev) => {
      const updated = { ...prev };
      fieldsToValidate.forEach((f) => (updated[f] = true));
      return updated;
    });

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = fieldsToValidate.find((f) => newErrors[f]);
      if (firstErrorField && errorRefs.current[firstErrorField]) {
        errorRefs.current[firstErrorField]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    (['name', 'email', 'phone', 'houseFlat', 'street', 'city', 'district', 'state', 'pincode', 'paymentMethod', 'utrNumber', 'acceptTerms'] as keyof FormData[]).forEach(
      (field) => {
        const error = validateField(field, form[field] as string | boolean);
        if (error) newErrors[field] = error;
      }
    );

    setErrors(newErrors);
    setTouched({
      name: true, email: true, phone: true, houseFlat: true, street: true,
      city: true, district: true, state: true, pincode: true,
      paymentMethod: true, utrNumber: true, acceptTerms: true,
    });

    if (Object.keys(newErrors).length > 0) {
      const order: (keyof FormData)[] = ['name', 'email', 'phone', 'houseFlat', 'street', 'city', 'district', 'state', 'pincode', 'paymentMethod', 'utrNumber', 'acceptTerms'];
      const firstErrorField = order.find((f) => newErrors[f]);
      if (firstErrorField) {
        if (step !== 'review') {
          setStep(firstErrorField === 'paymentMethod' || firstErrorField === 'utrNumber' ? 'payment' : 'address');
          setTimeout(() => {
            errorRefs.current[firstErrorField]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        } else {
          errorRefs.current[firstErrorField]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (form.paymentMethod !== 'UPI') {
      if (errors.utrNumber) setErrors((prev) => ({ ...prev, utrNumber: undefined }));
    }
  }, [form.paymentMethod]);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
        <Link to="/products" className="btn-primary mt-4 inline-block">Shop Now</Link>
      </div>
    );
  }

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `AGK-${timestamp}-${random}`;
  };

  const handlePlaceOrder = async () => {
    if (processing) return;

    if (!validateAll()) {
      showToast('Please fix the errors before placing your order.', 'error');
      return;
    }

    setProcessing(true);

    try {
      const orderNumber = generateOrderNumber();
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      }));

      const orders = JSON.parse(localStorage.getItem('agrimadeeazy-orders') || '[]');
      orders.push({
        id: orderNumber,
        items: orderItems,
        total,
        status: 'Pending',
        date: new Date().toISOString(),
        paymentMethod: form.paymentMethod,
        paymentStatus: 'Pending',
        utrNumber: form.paymentMethod === 'UPI' ? form.utrNumber.trim() : null,
        address: {
          name: form.name,
          phone: form.phone,
          houseFlat: form.houseFlat,
          street: form.street,
          city: form.city,
          district: form.district,
          state: form.state,
          pincode: form.pincode,
        },
      });
      localStorage.setItem('agrimadeeazy-orders', JSON.stringify(orders));

      clearCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/order-success/${orderNumber}`);
    } catch (err) {
      showToast('An unexpected error occurred. Please try again.', 'error');
      setProcessing(false);
    }
  };

  const steps = [
    { id: 'address' as const, label: 'Address', icon: MapPin },
    { id: 'payment' as const, label: 'Payment', icon: CreditCard },
    { id: 'review' as const, label: 'Review', icon: CheckCircle },
  ];

  const fieldClass = (fieldName: keyof FormErrors) =>
    `input-field ${errors[fieldName] && touched[fieldName] ? 'border-red-500 dark:border-red-500 ring-1 ring-red-500' : ''}`;

  const ErrorMsg = ({ name }: { name: keyof FormErrors }) =>
    errors[name] && touched[name] ? (
      <div ref={(el) => { errorRefs.current[name] = el; }} className="flex items-center gap-1 mt-1 text-xs text-red-500 dark:text-red-400">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        <span>{errors[name]}</span>
      </div>
    ) : <div ref={(el) => { errorRefs.current[name] = el; }} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center gap-2 ${step === s.id ? 'text-primary-700 dark:text-primary-400' : step > s.id ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step === s.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30' : step > s.id ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                {step > s.id ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-12 sm:w-24 h-0.5 mx-2 ${step > s.id ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {step === 'address' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Full Name *</label>
                  <input className={fieldClass('name')} value={form.name} onChange={(e) => handleChange('name', e.target.value)} onBlur={() => handleBlur('name')} placeholder="Enter your full name" />
                  <ErrorMsg name="name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Email Address *</label>
                  <input className={fieldClass('email')} type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} placeholder="example@gmail.com" />
                  <ErrorMsg name="email" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Phone Number *</label>
                <input className={fieldClass('phone')} type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} onBlur={() => handleBlur('phone')} placeholder="10-digit mobile number" maxLength={10} />
                <ErrorMsg name="phone" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">House/Flat Number *</label>
                  <input className={fieldClass('houseFlat')} value={form.houseFlat} onChange={(e) => handleChange('houseFlat', e.target.value)} onBlur={() => handleBlur('houseFlat')} placeholder="House No, Flat No" />
                  <ErrorMsg name="houseFlat" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Street Address *</label>
                  <input className={fieldClass('street')} value={form.street} onChange={(e) => handleChange('street', e.target.value)} onBlur={() => handleBlur('street')} placeholder="Street name, area" />
                  <ErrorMsg name="street" />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Village/City *</label>
                  <input className={fieldClass('city')} value={form.city} onChange={(e) => handleChange('city', e.target.value)} onBlur={() => handleBlur('city')} placeholder="City or village" />
                  <ErrorMsg name="city" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">District *</label>
                  <input className={fieldClass('district')} value={form.district} onChange={(e) => handleChange('district', e.target.value)} onBlur={() => handleBlur('district')} placeholder="District" />
                  <ErrorMsg name="district" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">State *</label>
                  <input className={fieldClass('state')} value={form.state} onChange={(e) => handleChange('state', e.target.value)} onBlur={() => handleBlur('state')} placeholder="State" />
                  <ErrorMsg name="state" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">Pincode *</label>
                <input className={fieldClass('pincode')} value={form.pincode} onChange={(e) => handleChange('pincode', e.target.value)} onBlur={() => handleBlur('pincode')} placeholder="6-digit pincode" maxLength={6} inputMode="numeric" />
                <ErrorMsg name="pincode" />
              </div>
              <button
                onClick={() => {
                  if (validateStep('address')) setStep('payment');
                }}
                className="btn-primary w-full sm:w-auto"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">Payment Method</h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleChange('paymentMethod', 'UPI')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${form.paymentMethod === 'UPI' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.paymentMethod === 'UPI' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">Pay via UPI</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Google Pay, PhonePe, Paytm, BHIM, Amazon Pay & all UPI apps</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === 'UPI' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                    {form.paymentMethod === 'UPI' && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </button>

                <button
                  onClick={() => handleChange('paymentMethod', 'COD')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${form.paymentMethod === 'COD' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.paymentMethod === 'COD' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">Cash on Delivery</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pay when you receive the order</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === 'COD' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                    {form.paymentMethod === 'COD' && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </button>
              </div>

              <ErrorMsg name="paymentMethod" />

              {form.paymentMethod === 'UPI' && (
                <div className="space-y-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
                  <div className="flex items-start gap-3">
                    <QrCode className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Pay ₹{total.toFixed(2)} via UPI</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Scan the QR code or click the UPI link below with any UPI app (Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, etc.)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`}
                      alt="UPI Payment QR Code"
                      className="w-48 h-48 rounded-lg bg-white p-2"
                    />
                    <a
                      href={upiLink}
                      className="text-sm text-primary-600 dark:text-primary-400 font-medium underline break-all"
                    >
                      Click here to pay via UPI app
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      UPI ID: <span className="font-mono font-semibold">{MERCHANT_UPI_ID}</span><br />
                      Amount: <span className="font-semibold">₹{total.toFixed(2)}</span>
                    </p>
                  </div>

                  <div className="border-t border-primary-200 dark:border-primary-800 pt-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
                      UPI Transaction ID (UTR) *
                    </label>
                    <input
                      className={fieldClass('utrNumber')}
                      value={form.utrNumber}
                      onChange={(e) => handleChange('utrNumber', e.target.value)}
                      onBlur={() => handleBlur('utrNumber')}
                      placeholder="Enter the 12-digit UTR / Transaction ID from your UPI app"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      After making the payment, copy the Transaction ID / UTR from your UPI app and paste it here.
                      Your order will be verified by our team before dispatch.
                    </p>
                    <ErrorMsg name="utrNumber" />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep('address')} className="btn-outline">Back</button>
                <button
                  onClick={() => {
                    if (validateStep('payment')) setStep('review');
                  }}
                  className="btn-primary"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">Review Your Order</h2>
              <div>
                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">Shipping To:</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300">
                  <p className="font-medium text-gray-800 dark:text-gray-100">{form.name}</p>
                  <p>{form.houseFlat}, {form.street}</p>
                  <p>{form.city}, {form.district}, {form.state} - {form.pincode}</p>
                  <p>Phone: {form.phone}</p>
                  <p>Email: {form.email}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">Items:</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 text-sm">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-100">{item.product.name}</p>
                        <p className="text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">Payment:</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {form.paymentMethod === 'UPI' ? `Pay via UPI (UTR: ${form.utrNumber})` : 'Cash on Delivery'}
                </p>
              </div>

              <div ref={(el) => { errorRefs.current['acceptTerms'] = el; }}>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                    onBlur={() => handleBlur('acceptTerms')}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the Terms & Conditions and confirm that the information provided is correct.
                  </span>
                </label>
                <ErrorMsg name="acceptTerms" />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('payment')} className="btn-outline" disabled={processing}>Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Place Order
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-32 space-y-3">
          <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Shipping</span><span className="font-semibold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Tax (5%)</span><span className="font-semibold">{formatPrice(tax)}</span></div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-baseline">
            <span className="font-bold text-gray-800 dark:text-white">Total</span>
            <span className="text-2xl font-bold text-primary-700 dark:text-primary-400">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
