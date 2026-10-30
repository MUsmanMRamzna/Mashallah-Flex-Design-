import React, { useState, useEffect } from 'react';
import {
  SERVICES,
  ServiceItem,
  BUSINESS_INFO,
} from '../data/businessData';
import {
  Send,
  Upload,
  FileCheck,
  Trash2,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Copy,
  ExternalLink,
  Info,
} from 'lucide-react';

interface OrderFormProps {
  selectedServiceId: string;
  onServiceChange: (serviceId: string) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  selectedServiceId,
  onServiceChange,
}) => {
  // Customer info
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  // Service & specs
  const [currentServiceId, setCurrentServiceId] = useState(
    selectedServiceId || SERVICES[0].id
  );
  const [width, setWidth] = useState<number | ''>(10);
  const [height, setHeight] = useState<number | ''>(3);
  const [unit, setUnit] = useState<'feet' | 'inches' | 'meters'>('feet');
  const [quantity, setQuantity] = useState<number>(1);
  const [material, setMaterial] = useState<string>('');
  const [designStatus, setDesignStatus] = useState<
    'ready' | 'needs_assistance'
  >('needs_assistance');
  const [deadline, setDeadline] = useState('');
  const [instructions, setInstructions] = useState('');

  // Local file state
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Form submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string>('');
  const [generatedMessageText, setGeneratedMessageText] = useState<string>('');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Sync when prop updates
  useEffect(() => {
    if (selectedServiceId) {
      setCurrentServiceId(selectedServiceId);
      const matched = SERVICES.find((s) => s.id === selectedServiceId);
      if (matched) {
        if (matched.defaultDimensions) {
          setWidth(matched.defaultDimensions.width);
          setHeight(matched.defaultDimensions.height);
        }
        if (matched.defaultUnit) {
          setUnit(matched.defaultUnit);
        }
        if (matched.recommendedQuantity) {
          setQuantity(matched.recommendedQuantity);
        }
        if (matched.materials.length > 0) {
          setMaterial(matched.materials[0]);
        }
      }
    }
  }, [selectedServiceId]);

  const activeService =
    SERVICES.find((s) => s.id === currentServiceId) || SERVICES[0];

  // Handle service switch
  const handleServiceSelect = (id: string) => {
    setCurrentServiceId(id);
    onServiceChange(id);
    const matched = SERVICES.find((s) => s.id === id);
    if (matched) {
      if (matched.defaultDimensions) {
        setWidth(matched.defaultDimensions.width);
        setHeight(matched.defaultDimensions.height);
      }
      if (matched.defaultUnit) {
        setUnit(matched.defaultUnit);
      }
      if (matched.recommendedQuantity) {
        setQuantity(matched.recommendedQuantity);
      }
      if (matched.materials.length > 0) {
        setMaterial(matched.materials[0]);
      }
    }
  };

  // Local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 50MB
    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFileError('File size exceeds 50MB limit.');
      return;
    }

    // Format file size
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    setSelectedFile({
      name: file.name,
      size: `${sizeMb} MB`,
      type: file.type || 'Artwork Document',
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError(null);
  };

  // Form Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone / WhatsApp number is required.';
    } else if (phoneNumber.trim().length < 8) {
      newErrors.phoneNumber = 'Please enter a valid phone number.';
    }

    if (activeService.hasDimensions) {
      if (!width || Number(width) <= 0) {
        newErrors.width = 'Width must be greater than 0.';
      }
      if (!height || Number(height) <= 0) {
        newErrors.height = 'Height must be greater than 0.';
      }
    }

    if (quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build message string
  const buildWhatsAppMessage = () => {
    const lines = [
      `*NEW ORDER INQUIRY - MASHALLAH FLEX PRINTING*`,
      `-----------------------------------------`,
      `*Customer Details:*`,
      `• Name: ${fullName.trim()}`,
      `• WhatsApp/Phone: ${phoneNumber.trim()}`,
      email.trim() ? `• Email: ${email.trim()}` : null,
      ``,
      `*Order Specifications:*`,
      `• Service: ${activeService.title}`,
      activeService.hasDimensions
        ? `• Dimensions: ${width} × ${height} ${unit}`
        : null,
      `• Quantity: ${quantity}`,
      material ? `• Selected Media/Material: ${material}` : null,
      `• Design Status: ${
        designStatus === 'ready'
          ? 'Ready Artwork Available'
          : 'Need Design & Layout Assistance'
      }`,
      deadline ? `• Required Deadline: ${deadline}` : null,
      selectedFile
        ? `• Artwork File (Attached): ${selectedFile.name} (${selectedFile.size})`
        : `• Artwork File: Not selected in browser (will send in chat)`,
      instructions.trim()
        ? `\n*Additional Instructions:*\n${instructions.trim()}`
        : null,
      ``,
      `-----------------------------------------`,
      `_Sent via Mashallah Flex Printing Order Portal_`,
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const msg = buildWhatsAppMessage();
    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${BUSINESS_INFO.phoneClean}?text=${encoded}`;

    setGeneratedMessageText(msg);
    setGeneratedWhatsAppUrl(waUrl);
    setSubmissionSuccess(true);
    setIsSubmitting(false);

    // Open WhatsApp in a new tab
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // If blocked, fallback dialog stays visible
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessageText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <section id="order" className="py-24 bg-white border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/60 mb-4">
            <span>Direct Order Request</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-950 tracking-tight leading-tight mb-4">
            Tell Us What You Need Printed.
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Fill in your project specifications below. Our interactive calculator formats your order and connects you straight to {BUSINESS_INFO.owner} on WhatsApp for personalized quote confirmation and direct proofing.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Form on Left (7 cols), Live Summary on Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Form (7 cols) */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-stone-50/60 rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-8"
          >
            {/* Step 1: Customer Contact */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                1. Customer Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Full Name <span className="text-amber-700">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="e.g. Tariq Mehmood"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 transition-all ${
                      errors.fullName
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-stone-200'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    WhatsApp / Phone Number <span className="text-amber-700">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (errors.phoneNumber)
                        setErrors({ ...errors, phoneNumber: '' });
                    }}
                    placeholder="e.g. +92 300 1234567"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 transition-all ${
                      errors.phoneNumber
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-stone-200'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Email Address <span className="text-stone-400">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. business@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Service Selection & Dynamic Adaptive Fields */}
            <div className="pt-6 border-t border-stone-200">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                2. Service & Product Specifications
              </div>

              {/* Service Dropdown */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Service Category <span className="text-amber-700">*</span>
                </label>
                <select
                  value={currentServiceId}
                  onChange={(e) => handleServiceSelect(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-stone-900 transition-all"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Adaptive Dimensions (Only for services where dimensions apply!) */}
              {activeService.hasDimensions && (
                <div className="mb-6 p-4 rounded-2xl bg-white border border-stone-200">
                  <div className="text-xs font-semibold text-stone-800 mb-3 flex items-center justify-between">
                    <span>Banner & Print Dimensions</span>
                    <span className="text-[11px] font-normal text-stone-500">
                      Adaptable measurement
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        value={width}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setWidth(val);
                          if (errors.width) setErrors({ ...errors, width: '' });
                        }}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          errors.width ? 'border-red-400 bg-red-50/20' : 'border-stone-200'
                        }`}
                      />
                      {errors.width && (
                        <p className="mt-1 text-[11px] text-red-600">{errors.width}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        value={height}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                          setHeight(val);
                          if (errors.height) setErrors({ ...errors, height: '' });
                        }}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          errors.height ? 'border-red-400 bg-red-50/20' : 'border-stone-200'
                        }`}
                      />
                      {errors.height && (
                        <p className="mt-1 text-[11px] text-red-600">{errors.height}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Unit
                      </label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white font-medium"
                      >
                        <option value="feet">Feet (ft)</option>
                        <option value="inches">Inches (in)</option>
                        <option value="meters">Meters (m)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity & Media Finish */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Quantity <span className="text-amber-700">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const q = parseInt(e.target.value) || 1;
                      setQuantity(q);
                      if (errors.quantity) setErrors({ ...errors, quantity: '' });
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white ${
                      errors.quantity ? 'border-red-400 bg-red-50/20' : 'border-stone-200'
                    }`}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Printing Material / Finish
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white text-stone-900"
                  >
                    {activeService.materials.map((mat) => (
                      <option key={mat} value={mat}>
                        {mat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Design Status Selection */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-stone-700 mb-2">
                  Design & Artwork Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      designStatus === 'ready'
                        ? 'border-stone-900 bg-stone-900 text-white font-medium'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="designStatus"
                      checked={designStatus === 'ready'}
                      onChange={() => setDesignStatus('ready')}
                      className="sr-only"
                    />
                    <div className="text-xs">
                      <div className="font-semibold">I have a ready design</div>
                      <div className={designStatus === 'ready' ? 'text-stone-300' : 'text-stone-500'}>
                        Print directly from my file
                      </div>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      designStatus === 'needs_assistance'
                        ? 'border-stone-900 bg-stone-900 text-white font-medium'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="designStatus"
                      checked={designStatus === 'needs_assistance'}
                      onChange={() => setDesignStatus('needs_assistance')}
                      className="sr-only"
                    />
                    <div className="text-xs">
                      <div className="font-semibold">I need design assistance</div>
                      <div className={designStatus === 'needs_assistance' ? 'text-stone-300' : 'text-stone-500'}>
                        {BUSINESS_INFO.owner} crafts artwork
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Deadline & Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Preferred Deadline <span className="text-stone-400">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Additional Instructions / Custom Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Mention custom colors, eyelet spacing, fold preferences, delivery notes, etc."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900"
                  />
                </div>
              </div>

              {/* Design File Upload (Client-side validation & local notice) */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Artwork / Reference File <span className="text-stone-400">(PDF, JPG, PNG, AI, PSD up to 50MB)</span>
                </label>

                {!selectedFile ? (
                  <label className="border-2 border-dashed border-stone-300 hover:border-stone-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white group">
                    <Upload className="w-8 h-8 text-stone-400 group-hover:text-stone-600 mb-2 transition-colors" />
                    <span className="text-xs font-semibold text-stone-800">
                      Click to choose local artwork file
                    </span>
                    <span className="text-[11px] text-stone-500 mt-1">
                      PDF, PNG, JPG, EPS, AI, or PSD
                    </span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.png,.jpg,.jpeg,.ai,.eps,.psd"
                      className="sr-only"
                    />
                  </label>
                ) : (
                  <div className="p-4 rounded-xl border border-stone-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-stone-900 truncate max-w-[200px] sm:max-w-xs">
                          {selectedFile.name}
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {selectedFile.size} · Local file selected
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {fileError && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {fileError}
                  </p>
                )}

                {/* Explicit Requirement: Explain that file is selected locally and not uploaded to server */}
                <div className="mt-2.5 flex items-start gap-2 text-[11px] text-stone-500 leading-normal bg-stone-100/70 p-2.5 rounded-lg border border-stone-200/60">
                  <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Note:</strong> In this frontend prototype, your artwork file is selected locally on your device and is not uploaded to a backend server. When WhatsApp opens, please attach your artwork file directly in the chat window alongside the generated specifications.
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Submit & Open WhatsApp Order</span>
              </button>
              <p className="text-[11px] text-stone-400 text-center mt-2.5">
                Opens pre-filled message with {BUSINESS_INFO.owner} at {BUSINESS_INFO.phone}
              </p>
            </div>
          </form>

          {/* Right Column: Live Order Summary (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Live Order Summary</h3>
                  <p className="text-xs text-stone-400">Review before transmitting to WhatsApp</p>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400">Pricing</div>
                  <div className="font-display font-bold text-sm text-stone-100">Quote Required</div>
                </div>
              </div>

              {/* Summary Items */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-stone-400 block mb-0.5">Selected Service</span>
                  <span className="font-semibold text-stone-100 text-sm">{activeService.title}</span>
                </div>

                {activeService.hasDimensions && (
                  <div>
                    <span className="text-stone-400 block mb-0.5">Dimensions & Format</span>
                    <span className="font-semibold text-stone-100 font-mono">
                      {width || '—'} × {height || '—'} {unit}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-stone-400 block mb-0.5">Order Quantity</span>
                    <span className="font-semibold text-stone-100">{quantity} units</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block mb-0.5">Artwork Status</span>
                    <span className="font-semibold text-stone-100">
                      {designStatus === 'ready' ? 'Ready Artwork' : 'Design Assistance'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 block mb-0.5">Media / Finish</span>
                  <span className="font-semibold text-stone-100">
                    {material || activeService.materials[0] || 'Standard Spec'}
                  </span>
                </div>

                {selectedFile && (
                  <div>
                    <span className="text-stone-400 block mb-0.5">Local Attachment</span>
                    <span className="font-semibold text-stone-200 truncate block">
                      {selectedFile.name} ({selectedFile.size})
                    </span>
                  </div>
                )}

                {deadline && (
                  <div>
                    <span className="text-stone-400 block mb-0.5">Target Delivery Date</span>
                    <span className="font-semibold text-amber-300 font-mono">{deadline}</span>
                  </div>
                )}
              </div>

              {/* Price Calculation Note */}
              <div className="mt-8 pt-4 border-t border-stone-800 text-[11px] text-stone-400 leading-normal">
                Exact quotation is calculated based on current square footage, roll material thickness, quantity discounts, and design adjustments. No fabricated prices are charged.
              </div>

              {/* Verified Owner Contact Block */}
              <div className="mt-6 p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-semibold text-stone-200">{BUSINESS_INFO.owner}</div>
                  <div className="text-stone-400 text-[11px]">Direct Line: {BUSINESS_INFO.phone}</div>
                </div>
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Submission Success / Fallback if WhatsApp popup fails */}
        {submissionSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/75 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-stone-950">
                      Order Summary Formatted
                    </h3>
                    <p className="text-xs text-stone-500">
                      Ready to transmit to WhatsApp
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSubmissionSuccess(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-semibold px-2 py-1 rounded-md"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Your order specifications have been generated. We attempted to open WhatsApp automatically. If WhatsApp did not launch or if you are using web, click the direct button below or copy the pre-formatted order summary.
                </p>

                {/* Formatted Text Box */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800 max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {generatedMessageText}
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-normal flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>File attachment reminder:</strong> Because this web prototype does not upload your local artwork to a server, please remember to click the paperclip attachment icon inside WhatsApp to send your file to {BUSINESS_INFO.owner}.
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href={generatedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Again</span>
                </a>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
