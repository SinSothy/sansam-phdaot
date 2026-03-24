import React, { useState, useRef, useEffect } from 'react';

export interface Owner {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const mockOwners: Owner[] = [
  { id: '1', name: 'Alex Rivera', email: 'alex@workspace.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHgiyBis4eKdUPuCOCzyZQu75qSAT4s6oBWnPjfhWniRBEEv0x79Jn4DOjQFa8UogI0aCkH1qe2xvpOMKk-8kO6oLuJ3JaSzIkZrKfjqQ2kmFi5ZygN6m5GDV_KtYWhqCiZ-5TGxjP4XMTkh4QXySy7Zr4Hdq7zdGWjzBRhz8VTRpZMVU1h3AcPI1rhJg2ubB69uNNJaI--jaSmAFJbGyQ7rk10nANrsWS30gZG6ZZQVflCJycEWfYTNHRwgoOWbayN4v5GjCu' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.c@workspace.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBArfKeSg0Jk5cp9DvJE6GlFjkznXG-lgeJfLrGnsCh5r0zDd57W42h6HCLjjqvrE6EuWF0TAi7sV5G3u84XyERELaswIs8pHc4ehONsKwxpvu658h5rqaVB51o7Khjk5WCtbqzLImoowiYDkw8ShKOoQvH8YZOCvpErqanPGD5O1fYzu94z0HdjCxhD0-HSl0Vtg7ySK5ZpKg5wthenBBK23YtXUoRHRfCta6_eHqv6TdhsXZfcHScEtIqiLp-CT30rI5XvsxD' },
  { id: '3', name: 'Mike Ross', email: 'mike.r@workspace.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOoSrxltiVoCno_Oc_djh3W9-mvxiVDbaNYD58WmPK5K_Xt3YAgxbUgUUw9fi_ZFLLcJ-kwC6afc4Q0FT_3mcgfNfJqQHVVRoBu4n--3yEgV4yNKgnJ9lRuAedV8RMHEMtzQE86D39Z_Li8_p-JXuARIR5c9bzyBcb12UmCPACsNQIbBhG0jI6S0RgE336pnWw1K_5CoxlLrOblWmgEH4abH2cFprJ_L6qcyhThs_se5FIoXXWjsf6e1vkhjf3qiPMJ_aNPE8G' }
];

interface OwnerSelectProps {
  value: Owner;
  onChange: (owner: Owner) => void;
}

export default function OwnerSelect({ value, onChange }: OwnerSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-surface-container-low/50 rounded-xl p-3 px-4 border border-outline-variant/20 hover:border-outline-variant/50 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <img className="w-10 h-10 rounded-full object-cover" src={value.avatar} alt="Owner" />
            <div className="absolute bottom-0 right-[-2px] w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-on-surface leading-tight">{value.name}</span>
            <span className="text-[11px] font-medium text-secondary mt-0.5">{value.email}</span>
          </div>
        </div>
        <span className={`material-symbols-outlined text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </div>

      {isOpen && (
        <div className="absolute z-[200] top-full mt-2 w-full bg-surface rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden">
          {mockOwners.map((owner) => (
            <div 
              key={owner.id}
              onClick={() => { onChange(owner); setIsOpen(false); }}
              className="flex items-center gap-4 p-3 px-4 hover:bg-surface-container-low cursor-pointer transition-colors"
            >
              <img className="w-8 h-8 rounded-full object-cover" src={owner.avatar} alt={owner.name} />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-on-surface leading-tight">{owner.name}</span>
                <span className="text-[11px] font-medium text-secondary mt-0.5">{owner.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
