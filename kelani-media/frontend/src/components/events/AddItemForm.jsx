import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ImagePicker from './ImagePicker.jsx';
import { eventService } from '../../services/eventService.js';

const EMPTY_ITEM = { name: '', description: '', price: '', imageUrl: '' };

// Form for organizers to add a ticket or another item to sell
const AddItemForm = ({ event, onUpdated }) => {
  const [item, setItem] = useState(EMPTY_ITEM);
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setItem({ ...item, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.name.trim()) {
      toast.error('Please enter the item name.');
      return;
    }

    setSaving(true);
    try {
      const updatedEvent = await eventService.addItem(event.id, {
        ...item,
        price: Number(item.price) || 0
      });
      toast.success('Item added!');
      onUpdated(updatedEvent);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add the item.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Item name</label>
        <input
          value={item.name}
          onChange={(e) => updateField('name', e.target.value)}
          maxLength={120}
          placeholder="e.g. General Admission Ticket"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Price (Rs.)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={item.price}
          onChange={(e) => updateField('price', e.target.value)}
          placeholder="0 for free"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea
          value={item.description}
          onChange={(e) => updateField('description', e.target.value)}
          maxLength={1000}
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>
      <ImagePicker value={item.imageUrl} onChange={(image) => updateField('imageUrl', image)} shape="square" maxWidth={800} />
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-[#800000] py-3 text-sm font-semibold text-white hover:bg-[#660000] disabled:opacity-50"
      >
        {saving ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
};

export default AddItemForm;
