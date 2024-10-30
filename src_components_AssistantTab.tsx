import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AssistantTab = ({ isPremium, onSend, handleChatGPTResponse, isLoading, setIsLoading }) => {
  const { t } = useTranslation();
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [isWorkFinished, setIsWorkFinished] = useState(false);

  const handleQueryChange = (e) => {
    setAssistantQuery(e.target.value);
  };

  const handleSend = async () => {
    if (assistantQuery.toLowerCase().includes("mewitsu workspace assistant premium") && !isPremium) {
      alert(t('assistant.premiumRequired'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await handleChatGPTResponse(assistantQuery);
      setAssistantResponse(response);
      onSend(response);
    } catch (error) {
      console.error("Error:", error);
      setAssistantResponse(t('assistant.error', { message: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWorkStatus = () => {
    setIsWorkFinished(!isWorkFinished);
    chrome.runtime.sendMessage({
      action: "setWorkStatus",
      status: !isWorkFinished
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6 text-purple-100 shadow-sm">
        {t('assistant.title', { type: isPremium ? t('premium') : t('free') })}
      </h2>
      <textarea
        className="w-full h-40 p-3 border-2 border-purple-400 rounded-lg focus:outline-none  focus:ring-2 focus:ring-purple-300 bg-purple-800 text-purple-100 placeholder-purple-300 shadow-md"
        placeholder={t('assistant.placeholder', { type: isPremium ? t('premium') : t('free') })}
        value={assistantQuery}
        onChange={handleQueryChange}
        aria-label={t('assistant.inputLabel')}
      />
      <button
        onClick={handleSend}
        className={`mt-2 ${
          isPremium ? "bg-purple-500 hover:bg-purple-600" : "bg-purple-700 hover:bg-purple-800"
        } text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out font-semibold shadow-lg ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
        aria-label={t('assistant.sendButton')}
      >
        {isLoading ? t('assistant.thinking') : t('assistant.help')}
      </button>
      {assistantResponse && (
        <div className="mt-4 p-3 bg-purple-800 rounded-lg">
          <p className="text-purple-100">{assistantResponse}</p>
        </div>
      )}
      {!isPremium && (
        <p className="mt-2 text-sm text-purple-300 font-medium shadow-sm">
          {t('assistant.upgrade')}
        </p>
      )}
      <button
        onClick={toggleWorkStatus}
        className={`mt-4 ${
          isWorkFinished ? "bg-green-500" : "bg-red-500"
        } text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out font-semibold shadow-lg`}
        aria-label={t('assistant.workStatusToggle')}
      >
        {isWorkFinished ? t('assistant.resumeWork') : t('assistant.finishWork')}
      </button>
    </div>
  );
};

export default AssistantTab;