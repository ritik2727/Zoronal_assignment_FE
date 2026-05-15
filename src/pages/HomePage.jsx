import { useState, useEffect, useCallback } from 'react';
import { getCompanies, getCities } from '../services/api';
import CompanyCard from '../components/CompanyCard';
import AddCompanyModal from '../components/AddCompanyModal';
import locationIcon from '../assets/images/locationIcon.svg';

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'rating', label: 'Average Rating' },
  { value: 'location', label: 'Location' },
];

export default function HomePage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cities, setCities] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('name');

  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Core fetch — called on mount and on sort change
  const fetchCompanies = useCallback(
    async (cityVal, sortVal) => {
      setLoading(true);
      try {
        const res = await getCompanies({ city: cityVal ?? city, sort: sortVal ?? sort });
        setCompanies(res.data.companies);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [city, sort]
  );

  // Load on mount + fetch cities for dropdown
  useEffect(() => {
    fetchCompanies('', 'name');
    getCities().then((res) => setCities(res.data)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch whenever sort changes (keep committed city)
  useEffect(() => {
    fetchCompanies(city, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  // "Find Company" button click
  const handleFindCompany = () => {
    setCity(cityInput);
    fetchCompanies(cityInput, sort);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreated = (newCompany) => {
    setCompanies((prev) => [{ ...newCompany, avgRating: 0, reviewCount: 0 }, ...prev]);
    setShowAddModal(false);
    showToast('Company added successfully!');
  };

  return (
    <>
      <div className="page-container">

        {/* ── Toolbar ──────────────────────────────────────────────── */}
        <div className="toolbar">

          {/* LEFT — Select City label + input + Find Company */}
          <div className="flex flex-col w-[60%] gap-[6px]">
            <span className="toolbar-label">Select City</span>

            <div className="flex flex-row  items-center gap-[22px]">

              {/* City select dropdown — location icon decorative */}
              <div className="search-box" style={{ position: 'relative' }}>
                <select
                  id="city-select"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  aria-label="Select city to filter companies"
                  style={{
                    width: '100%',
                    height: 37,
                    padding: '0 36px 0 14px',
                    border: '1.5px solid var(--clr-border)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    background: '#fff',
                    color: cityInput ? 'var(--clr-text-primary)' : 'var(--clr-placeholder)',
                    appearance: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {/* Location icon on the right */}
                <span style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  display: 'flex',
                }}>
                  <img src={locationIcon} alt="location icon" />
                </span>
              </div>

              {/* Find Company */}
              <button
                id="find-company-btn"
                className="btn btn-gradient"
                onClick={handleFindCompany}
                style={{ padding: '7px 20px', whiteSpace: 'nowrap' }}
              >
                Find Company
              </button>

            </div>
          </div>

          {/* RIGHT — Sort + Add Company */}
           <div className='flex flex-row items-end gap-[40px] ml-auto'> 
          <button
            id="add-company-btn"
            className="btn btn-gradient "
            onClick={() => setShowAddModal(true)}
            style={{ marginLeft: 'auto' }}
          >
            + Add Company
          </button>


           {/* Sort */}
          <div className='flex flex-col gap-[6px] '>
            <div>
             <span className="toolbar-label">Sort:</span>
            </div>
            <select
              id="sort-select"
              className="toolbar-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort companies"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          </div>
        </div>
        {/* ── End Toolbar ──────────────────────────────────────────── */}

        <hr className="border-[rgba(236,236,236,1)] mb-[88px] -mr-[65px] -ml-[65px]" />

        {/* Results count */}
        <div className="results-header">
          <p className="results-count">
            Result Found: <span>{companies.length}</span>
          </p>
        </div>

        {/* Company Grid */}
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : companies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <div className="empty-title">No companies found</div>
            <div className="empty-sub">
              {city
                ? `No results for "${city}". Try a different city.`
                : 'Try adding the first company!'}
            </div>
          </div>
        ) : (
          <div className="company-grid">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}

      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <AddCompanyModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
