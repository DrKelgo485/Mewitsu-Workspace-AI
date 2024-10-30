import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ScheduleTab = ({ onGenerateSchedule }) => {
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const getSchedule = async () => {
      if (chrome && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['schedule'], (result) => {
          setSchedule(result.schedule || []);
        });
      } else {
        console.warn('Chrome storage API not available');
        setSchedule([]);
      }
    };
    getSchedule();
  }, []);

  const handleGenerateSchedule = () => {
    const newSchedule = onGenerateSchedule();
    setSchedule(newSchedule);
    if (chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ schedule: newSchedule });
    } else {
      console.warn('Chrome storage API not available');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6 text-purple-100 shadow-sm">{t('schedule.title')}</h2>
      <button
        onClick={handleGenerateSchedule}
        className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out font-semibold shadow-lg"
        aria-label={t('schedule.generateButton')}
      >
        {t('schedule.generate')}
      </button>
      {schedule.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2 text-purple-100">{t('schedule.currentSchedule')}</h3>
          <ul className="space-y-2">
            {schedule.map((item, index) => (
              <li key={index} className="bg-purple-800 p-2 rounded-lg">
                <span className="font-bold">{item.time}: </span>
                <span>{item.task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduleTab;