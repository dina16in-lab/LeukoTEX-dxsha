import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import type { ContactFormData, FormStatus } from '../../types';
import { api } from '../../services/api';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    projectType: '',
    description: '',
    budget: '25k-50k',
  });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.projectType) {
      errors.projectType = 'Please select a project type';
    }

    if (!formData.description.trim()) {
      errors.description = 'Please provide a brief project description';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description should be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      await api.submitContact(formData);
      setStatus('success');

      // Trigger celebratory aesthetic confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#18a0fb', '#9acbff'],
        });
      } catch {
        // Fallback gracefully if confetti fails
      }

      // Reset after 4 seconds
      setTimeout(() => {
        setStatus('idle');
        setFormData({
          name: '',
          email: '',
          projectType: '',
          description: '',
          budget: '25k-50k',
        });
      }, 4000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'An error occurred while submitting your inquiry. Please try again.');
    }
  };

  const budgetOptions = [
    { label: '10k - 25k', value: '10k-25k' },
    { label: '25k - 50k', value: '25k-50k' },
    { label: '50k+', value: '50k+' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative z-10 flex flex-col gap-8 max-w-3xl w-full p-6 sm:p-10 md:p-12 rounded-2xl bg-white/30 border border-[#3E2723]/20 backdrop-blur-xl shadow-2xl"
    >
      {/* Name and Email Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Name */}
        <div className="flex flex-col relative group">
          <label
            htmlFor="name"
            className={`font-label-caps text-label-caps uppercase tracking-widest absolute transition-all duration-300 pointer-events-none ${
              formData.name ? '-top-4 text-[10px] text-[#3E2723]' : 'top-4 text-[#3E2723]'
            }`}
          >
            Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (validationErrors.name) setValidationErrors({ ...validationErrors, name: '' });
            }}
            placeholder=" "
            className={`peer w-full bg-transparent border-b py-4 text-[#3E2723] font-body-md focus:outline-none transition-colors focus:bg-white/10 ${
              validationErrors.name ? 'border-error text-error' : 'border-[#3E2723]/30 focus:border-[#3E2723]'
            }`}
          />
          {validationErrors.name && (
            <span className="text-error font-label-mono text-[11px] mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {validationErrors.name}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col relative group">
          <label
            htmlFor="email"
            className={`font-label-caps text-label-caps uppercase tracking-widest absolute transition-all duration-300 pointer-events-none ${
              formData.email ? '-top-4 text-[10px] text-[#3E2723]' : 'top-4 text-[#3E2723]'
            }`}
          >
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (validationErrors.email) setValidationErrors({ ...validationErrors, email: '' });
            }}
            placeholder=" "
            className={`peer w-full bg-transparent border-b py-4 text-[#3E2723] font-body-md focus:outline-none transition-colors focus:bg-white/10 ${
              validationErrors.email ? 'border-error text-error' : 'border-[#3E2723]/30 focus:border-[#3E2723]'
            }`}
          />
          {validationErrors.email && (
            <span className="text-error font-label-mono text-[11px] mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {validationErrors.email}
            </span>
          )}
        </div>
      </div>

      {/* Project Type Dropdown */}
      <div className="flex flex-col relative">
        <label
          htmlFor="project-type"
          className="font-label-caps text-label-caps text-[#3E2723] uppercase tracking-widest mb-1"
        >
          Project Type *
        </label>
        <div className="relative">
          <select
            id="project-type"
            required
            value={formData.projectType}
            onChange={(e) => {
              setFormData({ ...formData, projectType: e.target.value });
              if (validationErrors.projectType) setValidationErrors({ ...validationErrors, projectType: '' });
            }}
            className={`w-full bg-transparent border-b py-4 px-2 text-[#3E2723] font-body-md focus:outline-none transition-colors appearance-none cursor-pointer rounded-t-md ${
              validationErrors.projectType ? 'border-error' : 'border-[#3E2723]/30 focus:border-[#3E2723]'
            }`}
          >
            <option value="" disabled className="bg-[#F5F5DC] text-[#3E2723]">
              Select project scope...
            </option>
            <option value="3D Web Experience" className="bg-[#F5F5DC] text-[#3E2723]">
              3D Web Experience / WebGL
            </option>
            <option value="Portfolio & Editorial" className="bg-[#F5F5DC] text-[#3E2723]">
              Portfolio & Editorial Website
            </option>
            <option value="Interactive Application" className="bg-[#F5F5DC] text-[#3E2723]">
              Interactive Web Application
            </option>
            <option value="Creative Development" className="bg-[#F5F5DC] text-[#3E2723]">
              Creative Development & Architecture
            </option>
            <option value="Other Scope" className="bg-[#F5F5DC] text-[#3E2723]">
              Other / Custom Scope
            </option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#3E2723] pointer-events-none">
            expand_more
          </span>
        </div>
        {validationErrors.projectType && (
          <span className="text-error font-label-mono text-[11px] mt-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {validationErrors.projectType}
          </span>
        )}
      </div>

      {/* Project Description */}
      <div className="flex flex-col relative group">
        <label
          htmlFor="description"
          className={`font-label-caps text-label-caps uppercase tracking-widest absolute transition-all duration-300 pointer-events-none ${
            formData.description ? '-top-4 text-[10px] text-[#3E2723]' : 'top-4 text-[#3E2723]'
          }`}
        >
          Project Description *
        </label>
        <textarea
          id="description"
          rows={4}
          required
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            if (validationErrors.description) setValidationErrors({ ...validationErrors, description: '' });
          }}
          placeholder=" "
          className={`peer w-full bg-transparent border-b py-4 text-[#3E2723] font-body-md focus:outline-none transition-colors resize-none focus:bg-white/10 ${
            validationErrors.description ? 'border-error text-error' : 'border-[#3E2723]/30 focus:border-[#3E2723]'
          }`}
        />
        {validationErrors.description && (
          <span className="text-error font-label-mono text-[11px] mt-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {validationErrors.description}
          </span>
        )}
      </div>

      {/* Budget Radio Selectors */}
      <div className="flex flex-col gap-3 mt-2">
        <span className="font-label-caps text-label-caps text-[#3E2723] uppercase tracking-widest">
          Budget Tier (USD)
        </span>
        <div className="flex flex-wrap gap-3">
          {budgetOptions.map((opt) => (
            <label key={opt.value} className="cursor-pointer">
              <input
                type="radio"
                name="budget"
                value={opt.value}
                checked={formData.budget === opt.value}
                onChange={() => setFormData({ ...formData, budget: opt.value })}
                className="peer hidden"
              />
              <div className="px-6 py-3 border border-[#3E2723]/30 rounded-full text-[#3E2723] peer-checked:bg-[#3E2723] peer-checked:text-[#F5F5DC] peer-checked:border-[#3E2723] peer-checked:font-semibold transition-all duration-300 hover:border-[#3E2723] font-label-mono text-label-mono uppercase tracking-wider">
                {opt.label}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Error state alert */}
      {status === 'error' && (
        <div className="p-4 rounded-lg bg-error/10 border border-error/30 text-error flex items-center gap-3 text-sm">
          <span className="material-symbols-outlined">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button & Lifecycle States */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-4 relative group overflow-hidden bg-[#3E2723] text-[#F5F5DC] border border-[#3E2723] rounded-xl py-6 px-8 flex items-center justify-between transition-all duration-500 hover:shadow-[0_0_20px_rgba(62,39,35,0.3)] disabled:pointer-events-none"
      >
        <span className="relative z-10 font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold text-[#F5F5DC] transition-colors duration-500">
          Send Project Inquiry
        </span>
        <span className="material-symbols-outlined relative z-10 text-[#F5F5DC] transition-all duration-500 transform group-hover:translate-x-2">
          arrow_forward
        </span>

        {/* Hover slide backdrop */}
        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />

        {/* Loading Spinner Overlay */}
        {status === 'loading' && (
          <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center z-20">
            <span className="material-symbols-outlined animate-spin text-[#3E2723] text-[28px]">
              progress_activity
            </span>
          </div>
        )}

        {/* Success Overlay */}
        {status === 'success' && (
          <div className="absolute inset-0 bg-secondary-container flex items-center justify-center z-20 animate-in fade-in zoom-in-95 duration-300">
            <span className="font-label-caps text-label-caps tracking-[0.2em] uppercase font-bold text-[#3E2723] flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
              Received // Inquiry Dispatched
            </span>
          </div>
        )}
      </button>
    </form>
  );
};

