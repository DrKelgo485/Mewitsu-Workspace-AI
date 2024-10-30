import React from 'react';
import { useTranslation } from 'react-i18next';

const FileToolsTab = ({ isPremium, onFormatPDF, onConvertImage, onCompressFile, onEncryptFile, onMergeFiles }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6 text-purple-100 shadow-sm">{t('filetools.title')}</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onFormatPDF}
          className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out font-semibold shadow-lg"
          aria-label={t('filetools.formatPDFButton')}
        >
          {t('filetools.formatPDF')}
        </button>
        <button
          onClick={onConvertImage}
          className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out font-semibold shadow-lg"
          aria-label={t('filetools.convertImageButton')}
        >
          {t('filetools.convertImage')}
        </button>
        {isPremium && (
          <>
            <button
              onClick={onCompressFile}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out font-semibold shadow-lg"
              aria-label={t('filetools.compressFileButton')}
            >
              {t('filetools.compressFile')}
            </button>
            <button
              onClick={onEncryptFile}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out font-semibold shadow-lg"
              aria-label={t('filetools.encryptFileButton')}
            >
              {t('filetools.encryptFile')}
            </button>
            <button
              onClick={onMergeFiles}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg transition duration-300 ease-in-out font-semibold shadow-lg"
              aria-label={t('filetools.mergeFilesButton')}
            >
              {t('filetools.mergeFiles')}
            </button>
          </>
        )}
      </div>
      {!isPremium && (
        <p className="mt-2 text-sm text-purple-300 font-medium shadow-sm">
          {t('filetools.upgrade')}
        </p>
      )}
    </div>
  );
};

export default FileToolsTab;