/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react';

export default function VerificationWizard() {
  const [step, setStep] = useState(0);
  const [bizName, setBizName] = useState('');
  const [bizType, setBizType] = useState('Restaurant');
  const [owner, setOwner] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('Gulberg III');

  const steps = ['Business Info', 'Address', 'Upload Docs', 'Success'];

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto max-w-2xl mx-auto space-y-6">
      <div className="border-b border-brand-border pb-4">
        <h1 className="font-syne font-extrabold text-2xl text-brand-text flex items-center gap-1.5 leading-none">
          🛡️ Verified Scout Status
        </h1>
        <p className="text-xs text-brand-text2 mt-1">
          Scout or Merchant Verification unlocks higher priority visibility indices and verified blue badges on active deal lists.
        </p>
      </div>

      {/* STEP PROGRESS TRACK */}
      <div className="flex items-center gap-2 select-none">
        {steps.map((label, idx) => (
          <div key={idx} className="flex-1 flex flex-col gap-1.5">
            <div className={`h-1 rounded-full transition-colors ${
              idx < step 
                ? 'bg-brand-green' 
                : idx === step 
                  ? 'bg-brand-accent' 
                  : 'bg-brand-border'
            }`} />
            <span className={`text-[9px] font-bold uppercase tracking-wider text-center ${
              idx === step ? 'text-brand-text' : 'text-brand-text3'
            }`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* RENDER CONTENT DIRECTLY */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4 shadow-xl">
        {step === 0 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-brand-text block uppercase tracking-wide">Step 1: Business Profile Information</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wide">Store / Scout Brand Name</label>
              <input 
                type="text" 
                value={bizName} 
                onChange={(e) => setBizName(e.target.value)}
                placeholder="e.g. Cafe Gourmet Lahore" 
                className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text outline-none focus:border-brand-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wide mt-1.5 bh">Entity Type</label>
                <select 
                  value={bizType}
                  onChange={(e) => setBizType(e.target.value)}
                  className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text outline-none focus:border-brand-accent"
                >
                  <option value="Restaurant">Dining / Cafe</option>
                  <option value="Retail">Retail Store</option>
                  <option value="Beauty">Beauty Salon</option>
                  <option value="Sports">Gym / Sports</option>
                  <option value="Scout">Local Independent Scout</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wide mt-1.5 bh">Owner Name</label>
                <input 
                  type="text" 
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="Ahsan Khan" 
                  className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wide mb-1 block mt-1.5">Owner Contact Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567" 
                className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text outline-none focus:border-brand-accent"
              />
            </div>

            <button 
              onClick={() => setStep(1)}
              className="w-full bg-gradient-to-r from-brand-accent to-brand-accent2 text-white font-bold text-xs py-3 rounded-xl hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              Configure Store Address Location
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-brand-text block uppercase tracking-wide">Step 2: Map Store Address</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wide">Street / Road Plaza</label>
              <input 
                type="text" 
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="14-A, MM Alam Road" 
                className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text outline-none focus:border-brand-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wide">Town Sector</label>
              <input 
                type="text" 
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Gulberg III, Lahore" 
                className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text"
              />
            </div>

            {/* INTERACTIVE PICKER BLOCK */}
            <div 
              onClick={() => alert("Simulating map pin pickup coordinates coordinate: (lat: 44, lng: 32) loaded!")}
              className="p-4 bg-brand-bg3 border border-brand-border hover:border-brand-accent/50 rounded-xl flex flex-col justify-center items-center gap-1 cursor-pointer select-none py-8 text-center"
            >
              <span className="text-2xl">🗺️</span>
              <strong className="text-xs text-brand-text font-bold">Pick Coordinates Pointer</strong>
              <span className="text-[10px] text-brand-text3">Click to drop pin at exact storefront on Lahore model canvas</span>
            </div>

            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => setStep(0)}
                className="flex-1 bg-brand-bg3 border border-brand-border text-brand-text2 font-bold text-xs py-3 rounded-xl hover:text-brand-text hover:border-brand-text2 cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button 
                onClick={() => setStep(2)}
                className="flex-1 bg-gradient-to-r from-brand-accent to-brand-accent2 text-white font-bold text-xs py-3 rounded-xl hover:opacity-95 cursor-pointer flex items-center justify-center gap-1"
              >
                Upload Documents Verification
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-brand-text block uppercase tracking-wide">Step 3: Upload Scout Proof Files</h3>
            <p className="text-[11px] text-brand-text2">Attach proof files like government IDs, SECP registrations, or physical business frontage images.</p>

            <div className="space-y-3">
              {[
                { label: 'Merchant Trade Certificate', format: 'SECP Registration / Tax FBR' },
                { label: 'Scout CNIC Card', format: 'Front & Back image passport layouts' },
                { label: 'Store Physical Exterior', format: 'Clear signage front storefront image' }
              ].map((doc, idx) => (
                <div 
                  key={idx}
                  onClick={() => alert(`Simulating file explorer pickup for ${doc.label}.`)}
                  className="p-3 border border-dashed border-brand-border hover:border-brand-accent hover:opacity-95 rounded-xl text-center cursor-pointer select-none space-y-1"
                >
                  <UploadCloud className="w-6 h-6 text-brand-text3 mx-auto" />
                  <strong className="text-xs text-brand-text block font-bold">{doc.label}</strong>
                  <span className="text-[10px] text-brand-text3 block">{doc.format}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 bg-brand-bg3 border border-brand-border text-brand-text2 font-bold text-xs py-3 rounded-xl hover:text-brand-text hover:border-brand-text2 cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button 
                onClick={() => setStep(3)}
                className="flex-1 bg-gradient-to-r from-brand-accent to-brand-accent2 text-white font-bold text-xs py-3 rounded-xl hover:opacity-95 cursor-pointer flex items-center justify-center gap-1"
              >
                Submit SECP Forms
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-6 text-center space-y-4 animate-scaleUp">
            <div className="w-20 h-20 bg-brand-green/10 border-2 border-brand-green border-dashed rounded-full flex items-center justify-center mx-auto text-brand-green">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-brand-text font-syne uppercase">Submission Complete!</h2>
              <p className="text-xs text-brand-text2 max-w-sm mx-auto leading-relaxed">
                Appraisal documents and street locations coordinates are submitted successfully. Our Lahore auditing operations team will authorize your profile verified green badge within 2 to 3 days!
              </p>
            </div>

            <button 
              onClick={() => setStep(0)}
              className="bg-brand-surface2 text-brand-accent font-bold text-xs border border-brand-border py-2 px-6 rounded-xl hover:bg-brand-surface3 cursor-pointer select-none"
            >
              Restart Submission Forms
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
