import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AdBlockTab = () => {
  const { t } = useTranslation();
  const [blockedWebsites, setBlockedWebsites] = useState([]);
  const [newWebsite, setNewWebsite] = useState("");

  useEffect(() => {
    const getBlockedWebsites = async () => {
      if (chrome && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['blockedWebsites'], (result) => {
          setBlockedWebsites(result.blockedWebsites || []);
        });
      } else {
        console.warn('Chrome storage API not available');
        setBlockedWebsites([]);
      }
    };
    getBlockedWebsites();
  }, []);

  const handleAddWebsite = () => {
    const trimmedWebsite = newWebsite.trim();
    if (trimmedWebsite && !blockedWebsites.includes(trimmedWebsite)) {
      const updatedBlockedWebsites = [...blockedWebsites, trimmedWebsite];
      setBlockedWebsites(updatedBlockedWebsites);
      if (chrome && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ blockedWebsites: updatedBlockedWebsites });
      } else {
        console.warn('Chrome storage API not available');
      }
      setNewWebsite("");
    }
  };

  const handleRemoveWebsite = (website) => {
    const updatedBlockedWebsites = blockedWebsites.filter((site) => site !== website);
    setBlockedWebsites(updatedBlockedWebsites);
    if (chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ blockedWebsites: updatedBlockedWebsites });
    } else {
      console.warn('Chrome storage API not available');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6 text-purple-100 shadow-sm">{t('adblock.title')}</h2>
      <p className="text-purple-200 text-lg shadow-sm">
        {t('adblock.description')}
      </p>
      <div className="mt-4">
        <input
          type="text"
          value={newWebsite}
          onChange={(e) => setNewWebsite(e.target.value)}
          placeholder={t('adblock.placeholder')}
          className="p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-purple-800 text-purple-100"
          aria-label={t('adblock.inputLabel')}
        />
        <button
          onClick={handleAddWebsite}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg transition duration-300 ease-in-out"
          aria-label={t('adblock.addButton')}
        >
          {t('adblock.add')}
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {blockedWebsites.map((website) => (
          <li key={website} className="flex justify-between items-center bg-purple-800 p-2 rounded-lg">
            <span>{website}</span>
            <button
              onClick={() => handleRemoveWebsite(website)}
              className="text-red-500 hover:text-red-600"
              aria-label={t('adblock.removeButton', { website })}
            >
              {t('adblock.remove')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdBlockTab;