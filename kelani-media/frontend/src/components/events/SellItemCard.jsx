import React from 'react';
import { HiOutlineExternalLink, HiOutlineTicket } from 'react-icons/hi';
import { formatPrice } from '../../utils/eventUtils.js';

// One ticket / item that the event is selling (left column of the event page)
const SellItemCard = ({ item, onBuy, buying }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-gray-100">
          <HiOutlineTicket className="h-12 w-12 text-gray-300" />
        </div>
      )}

      <div className="space-y-3 bg-gray-50 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-gray-900">{item.name}</p>
          <span className="whitespace-nowrap text-sm font-bold text-[#800000]">{formatPrice(item.price)}</span>
        </div>
        {item.description && <p className="text-xs text-gray-500">{item.description}</p>}

        <button
          type="button"
          onClick={() => onBuy(item)}
          disabled={buying}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#800000] py-2 text-xs font-semibold text-white hover:bg-[#660000] disabled:opacity-50"
        >
          <HiOutlineExternalLink className="h-4 w-4" />
          {buying ? 'Buying...' : 'Buy Tickets'}
        </button>
      </div>
    </div>
  );
};

export default SellItemCard;
