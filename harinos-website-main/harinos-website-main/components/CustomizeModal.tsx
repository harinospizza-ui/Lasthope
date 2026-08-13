import React, { useState, useEffect } from 'react';
import { MenuItem, MenuItemOption, SelectedOptionSnapshot, OptionChoice } from '../types';

interface CustomizeModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  preSelectedSize?: string;
  onConfirm: (
    selectedSize?: string,
    selectedOptions?: SelectedOptionSnapshot[],
    specialInstructions?: string
  ) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  item,
  isOpen,
  onClose,
  preSelectedSize,
  onConfirm,
}) => {
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Dynamically build effective option groups.
  // If the item has legacy 'sizes' and no options specify a 'Size' group, we synthesize one.
  const effectiveOptions = React.useMemo((): MenuItemOption[] => {
    const list = [...(item.options || [])];
    const hasSizeOption = list.some((opt) => opt.name.toLowerCase() === 'size');

    if (item.sizes && item.sizes.length > 0 && !hasSizeOption) {
      list.unshift({
        id: 'opt_legacy_size',
        name: 'Size',
        type: 'select_one',
        required: true,
        choices: item.sizes.map((sz, idx) => ({
          id: `choice_sz_${idx}`,
          label: sz.label,
          priceModifier: sz.price - item.price, // Calculate modifier based on item base price
        })),
      });
    }

    // Synthesize default options for category Momos and Fries if missing
    if (item.category === 'Momos' && list.length === 0) {
      list.push({
        id: 'opt_momos_portion',
        name: 'Portion',
        type: 'select_one',
        required: true,
        choices: [
          { id: 'choice_momos_half', label: 'Half Plate', priceModifier: -40 },
          { id: 'choice_momos_full', label: 'Full Plate', priceModifier: 0 }
        ]
      });
    }

    if (item.category === 'Fries' && list.length === 0) {
      list.push({
        id: 'opt_fries_portion',
        name: 'Portion',
        type: 'select_one',
        required: true,
        choices: [
          { id: 'choice_fries_half', label: 'Half', priceModifier: -30 },
          { id: 'choice_fries_full', label: 'Full', priceModifier: 0 }
        ]
      });
    }

    return list;
  }, [item]);

  // Set default selections when modal opens or item changes
  useEffect(() => {
    const defaults: Record<string, string[]> = {};
    effectiveOptions.forEach((opt) => {
      if (opt.name.toLowerCase() === 'size' && preSelectedSize) {
        const matched = opt.choices.find(
          (c) => c.label.toLowerCase() === preSelectedSize.toLowerCase()
        );
        if (matched) {
          defaults[opt.id] = [matched.id];
          return;
        }
      }
      if (opt.required && opt.choices.length > 0) {
        // Default to first choice for single select, or empty array for multi
        defaults[opt.id] = opt.type === 'select_one' ? [opt.choices[0].id] : [];
      } else {
        defaults[opt.id] = [];
      }
    });
    setSelections(defaults);
    setSpecialInstructions('');
  }, [effectiveOptions, preSelectedSize]);

  if (!isOpen) return null;

  const handleSelectOne = (optionId: string, choiceId: string) => {
    setSelections((prev) => ({
      ...prev,
      [optionId]: [choiceId],
    }));
  };

  const handleSelectMany = (optionId: string, choiceId: string) => {
    setSelections((prev) => {
      const current = prev[optionId] || [];
      const updated = current.includes(choiceId)
        ? current.filter((id) => id !== choiceId)
        : [...current, choiceId];
      return {
        ...prev,
        [optionId]: updated,
      };
    });
  };

  // Compute live customized item price
  const totalItemPrice = (() => {
    let price = item.price;
    effectiveOptions.forEach((opt) => {
      const selected = selections[opt.id] || [];
      selected.forEach((choiceId) => {
        const choice = opt.choices.find((c) => c.id === choiceId);
        if (choice) {
          price += choice.priceModifier;
        }
      });
    });
    return Math.max(0, price);
  })();

  const handleConfirmClick = () => {
    // Build SelectedOptionSnapshot list
    const snapshotList: SelectedOptionSnapshot[] = [];
    let selectedSizeLabel: string | undefined = undefined;

    effectiveOptions.forEach((opt) => {
      const selected = selections[opt.id] || [];
      selected.forEach((choiceId) => {
        const choice = opt.choices.find((c) => c.id === choiceId);
        if (choice) {
          if (opt.name.toLowerCase() === 'size') {
            selectedSizeLabel = choice.label;
          }
          snapshotList.push({
            optionId: opt.id,
            optionName: opt.name,
            choiceId: choice.id,
            choiceLabel: choice.label,
            priceModifier: choice.priceModifier,
          });
        }
      });
    });

    onConfirm(selectedSizeLabel, snapshotList, specialInstructions.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-950/75 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-slide-up">
      <div className="w-full max-w-md rounded-t-[2.5rem] bg-white p-6 shadow-2xl sm:rounded-[2.5rem] relative flex flex-col max-h-[85vh] sm:max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full bg-slate-100 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          aria-label="Close Customization"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <h3 className="font-display text-2xl font-black text-slate-900">{item.name}</h3>
          <p className="text-xs text-slate-500 mt-1 leading-snug">{item.description}</p>
        </div>

        {/* Options List Container */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-1">
          {effectiveOptions.map((opt) => {
            const isSingle = opt.type === 'select_one';
            const selectedIds = selections[opt.id] || [];

            return (
              <div key={opt.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    {opt.name}
                  </h4>
                  {opt.required && (
                    <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </div>

                <div className="grid gap-2">
                  {opt.choices.map((choice) => {
                    const isSelected = selectedIds.includes(choice.id);
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() =>
                          isSingle
                            ? handleSelectOne(opt.id, choice.id)
                            : handleSelectMany(opt.id, choice.id)
                        }
                        className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-red-500 bg-red-50/30 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-all ${
                              isSingle
                                ? 'rounded-full'
                                : 'rounded-md'
                            } ${
                              isSelected
                                ? 'border-red-600 bg-red-655 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && (
                              <span className="text-[10px] leading-none">✓</span>
                            )}
                          </span>
                          <span className={`text-xs font-bold ${isSelected ? 'text-red-700' : 'text-slate-800'}`}>
                            {choice.label}
                          </span>
                        </span>
                        <span className="text-xs font-black text-slate-500">
                          {choice.priceModifier > 0
                            ? `+Rs ${choice.priceModifier}`
                            : choice.priceModifier < 0
                            ? `-Rs ${Math.abs(choice.priceModifier)}`
                            : (opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'portion')
                            ? `Rs ${item.price}`
                            : 'Free'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions */}
          <div className="pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Special Instructions
            </h4>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. No onions, make it spicy, well-done crust..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-all shadow-inner resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-[9px] font-black uppercase tracking-wider text-slate-400">Total Price</div>
            <div className="text-xl font-black text-red-600 font-display">Rs {totalItemPrice}</div>
          </div>

          <button
            type="button"
            onClick={handleConfirmClick}
            className="flex-1 max-w-[200px] rounded-2xl bg-red-650 hover:bg-red-500 text-white py-4 text-[10px] font-black uppercase tracking-widest transition-premium active:scale-95 shadow-lg shadow-red-200"
          >
            Add to Basket
          </button>
        </div>
      </div>
    </div>
  );
};
