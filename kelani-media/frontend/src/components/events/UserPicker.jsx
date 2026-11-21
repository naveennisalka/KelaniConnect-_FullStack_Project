import React, { useEffect, useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService.js';

// Search box to find students by name.
// When the user clicks the button next to a student we call onSelect(student).
// excludeIds = students that should not be shown (already added)
const UserPicker = ({ onSelect, excludeIds = [], buttonLabel = 'Add' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const text = query.trim();
    if (text.length < 2) {
      setResults([]);
      return;
    }

    // Wait until the user stops typing for 400ms, then search
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        setResults(await userService.search(text));
      } catch {
        toast.error('Could not search students. Please try again.');
      } finally {
        setSearching(false);
      }
    }, 400);

    // If the user types again before 400ms, cancel the old search
    return () => clearTimeout(timer);
  }, [query]);

  const visibleResults = results.filter((student) => !excludeIds.includes(student.id));

  return (
    <div className="space-y-3">
      <div className="relative">
        <HiOutlineSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search students by name..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
        />
      </div>

      {searching && <p className="text-xs text-gray-400">Searching...</p>}

      {!searching && query.trim().length >= 2 && visibleResults.length === 0 && (
        <p className="text-xs text-gray-400">No students found.</p>
      )}

      <div className="space-y-2">
        {visibleResults.map((student) => (
          <div key={student.id} className="flex items-center justify-between gap-3 rounded-xl p-2 hover:bg-gray-50">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                {(student.firstName || 'S').charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {`${student.firstName || ''} ${student.lastName || ''}`.trim()}
                </p>
                <p className="truncate text-xs text-gray-400">{student.degreeProgram || student.faculty}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelect(student)}
              className="flex-shrink-0 rounded-lg bg-[#800000]/10 px-3 py-1 text-xs font-semibold text-[#800000] hover:bg-[#800000] hover:text-white"
            >
              {buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPicker;
