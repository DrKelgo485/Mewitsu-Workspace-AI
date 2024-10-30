import React, { useState, useEffect, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import './i18n';

const AssistantTab = lazy(() => import('./components/AssistantTab'));
const AdBlockTab = lazy(() => import('./components/AdBlockTab'));
const ScheduleTab = lazy(() => import('./components/ScheduleTab'));
const FileToolsTab = lazy(() => import('./components/FileToolsTab'));

function MainComponent({
  activeTab,
  onSend,
  onGenerateSchedule,
  onFormatPDF,
  onConvertImage,
  onEnableFocusMode,
  onOrganizeFiles,
  isPremium,
  onCompressFile,
  onEncryptFile,
  onMergeFiles,
}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleChatGPTResponse = async (query: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: query }],
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error in AI response:', error);
      throw new Error('Failed to get AI response. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-purple-900 rounded-xl shadow-2xl text-purple-100">
      <Suspense fallback={<div>Loading...</div>}>
        {activeTab === "assistant" && (
          <AssistantTab
            isPremium={isPremium}
            onSend={onSend}
            handleChatGPTResponse={handleChatGPTResponse}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        {activeTab === "adblock" && <AdBlockTab />}
        {activeTab === "schedule" && <ScheduleTab onGenerateSchedule={onGenerateSchedule} />}
        {activeTab === "filetools" && (
          <FileToolsTab
            isPremium={isPremium}
            onFormatPDF={onFormatPDF}
            onConvertImage={onConvertImage}
            onCompressFile={onCompressFile}
            onEncryptFile={onEncryptFile}
            onMergeFiles={onMergeFiles}
          />
        )}
      </Suspense>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("assistant");
  const [isPremium, setIsPremium] = useState(false);
  const { t } = useTranslation();

  const generateSchedule = () => {
    const schedule = [
      { task: "Study Math", time: new Date(Date.now() + 1000 * 60 * 60).toISOString() },
      { task: "Break", time: new Date(Date.now() + 1000 * 60 * 120).toISOString() },
      { task: "Study Science", time: new Date(Date.now() + 1000 * 60 * 180).toISOString() }
    ];
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({action: "setSchedule", schedule: schedule}, (response) => {
        console.log(response ? response.status : 'No response');
      });
    } else {
      console.warn('Chrome runtime API not available');
    }
    alert(t('schedule.generated'));
  };

  const formatPDF = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "formatPDF"});
    });
    alert(t('filetools.pdfFormatted'));
  };

  const convertImage = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "convertImage"});
    });
    alert(t('filetools.imageConverted'));
  };

  const compressFile = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "compressFile"});
    });
    alert(t('filetools.fileCompressed'));
  };

  const encryptFile = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "encryptFile"});
    });
    alert(t('filetools.fileEncrypted'));
  };

  const mergeFiles = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "mergeFiles"});
    });
    alert(t('filetools.filesMerged'));
  };

  const enableFocusMode = (enabled) => {
    if (chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ isFocusModeEnabled: enabled });
    } else {
      console.warn('Chrome storage API not available');
    }
    alert(t('focusMode.toggle', { enabled: enabled ? t('enabled') : t('disabled') }));
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={() => setActiveTab("assistant")}
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "assistant" ? "bg-purple-600" : "bg-purple-400"
          }`}
          aria-label={t('nav.assistant')}
        >
          {t('nav.assistant')}
        </button>
        <button
          onClick={() => setActiveTab("adblock")}
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "adblock" ? "bg-purple-600" : "bg-purple-400"
          }`}
          aria-label={t('nav.adblock')}
        >
          {t('nav.adblock')}
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "schedule" ? "bg-purple-600" : "bg-purple-400"
          }`}
          aria-label={t('nav.schedule')}
        >
          {t('nav.schedule')}
        </button>
        <button
          onClick={() => setActiveTab("filetools")}
          className={`px-4 py-2 rounded ${
            activeTab === "filetools" ? "bg-purple-600" : "bg-purple-400"
          }`}
          aria-label={t('nav.filetools')}
        >
          {t('nav.filetools')}
        </button>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={() => setIsPremium(!isPremium)}
            className="form-checkbox h-5 w-5 text-purple-600"
            aria-label={t('premium.toggle')}
          />
          <span className="ml-2 text-purple-100">{t('premium.label')}</span>
        </label>
      </div>
      <MainComponent
        activeTab={activeTab}
        onSend={(response) => console.log("Assistant response:", response)}
        onGenerateSchedule={generateSchedule}
        onFormatPDF={formatPDF}
        onConvertImage={convertImage}
        onEnableFocusMode={enableFocusMode}
        onOrganizeFiles={() => alert(t('filetools.filesOrganized'))}
        isPremium={isPremium}
        onCompressFile={compressFile}
        onEncryptFile={encryptFile}
        onMergeFiles={mergeFiles}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));