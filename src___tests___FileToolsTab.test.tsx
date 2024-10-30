import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FileToolsTab from '../components/FileToolsTab';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('FileToolsTab', () => {
  const mockOnFormatPDF = jest.fn();
  const mockOnConvertImage = jest.fn();
  const mockOnCompressFile = jest.fn();
  const mockOnEncryptFile = jest.fn();
  const mockOnMergeFiles = jest.fn();

  it('renders correctly for non-premium users', () => {
    const { getByText, queryByText } = render(
      <FileToolsTab
        isPremium={false}
        onFormatPDF={mockOnFormatPDF}
        onConvertImage={mockOnConvertImage}
        onCompressFile={mockOnCompressFile}
        onEncryptFile={mockOnEncryptFile}
        onMergeFiles={mockOnMergeFiles}
      />
    );

    expect(getByText('filetools.title')).toBeInTheDocument();
    expect(getByText('filetools.formatPDF')).toBeInTheDocument();
    expect(getByText('filetools.convertImage')).toBeInTheDocument();
    expect(queryByText('filetools.compressFile')).not.toBeInTheDocument();
    expect(queryByText('filetools.encryptFile')).not.toBeInTheDocument();
    expect(queryByText('filetools.mergeFiles')).not.toBeInTheDocument();
    expect(getByText('filetools.upgrade')).toBeInTheDocument();
  });

  it('renders correctly for premium users', () => {
    const { getByText, queryByText } = render(
      <FileToolsTab
        isPremium={true}
        onFormatPDF={mockOnFormatPDF}
        onConvertImage={mockOnConvertImage}
        onCompressFile={mockOnCompressFile}
        onEncryptFile={mockOnEncryptFile}
        onMergeFiles={mockOnMergeFiles}
      />
    );

    expect(getByText('filetools.title')).toBeInTheDocument();
    expect(getByText('filetools.formatPDF')).toBeInTheDocument();
    expect(getByText('filetools.convertImage')).toBeInTheDocument();
    expect(getByText('filetools.compressFile')).toBeInTheDocument();
    expect(getByText('filetools.encryptFile')).toBeInTheDocument();
    expect(getByText('filetools.mergeFiles')).toBeInTheDocument();
    expect(queryByText('filetools.upgrade')).not.toBeInTheDocument();
  });

  it('calls the correct functions when buttons are clicked', () => {
    const { getByText } = render(
      <FileToolsTab
        isPremium={true}
        onFormatPDF={mockOnFormatPDF}
        onConvertImage={mockOnConvertImage}
        onCompressFile={mockOnCompressFile}
        onEncryptFile={mockOnEncryptFile}
        onMergeFiles={mockOnMergeFiles}
      />
    );

    fireEvent.click(getByText('filetools.formatPDF'));
    expect(mockOnFormatPDF).toHaveBeenCalledTimes(1);

    fireEvent.click(getByText('filetools.convertImage'));
    expect(mockOnConvertImage).toHaveBeenCalledTimes(1);

    fireEvent.click(getByText('filetools.compressFile'));
    expect(mockOnCompressFile).toHaveBeenCalledTimes(1);

    fireEvent.click(getByText('filetools.encryptFile'));
    expect(mockOnEncryptFile).toHaveBeenCalledTimes(1);

    fireEvent.click(getByText('filetools.mergeFiles'));
    expect(mockOnMergeFiles).toHaveBeenCalledTimes(1);
  });
});