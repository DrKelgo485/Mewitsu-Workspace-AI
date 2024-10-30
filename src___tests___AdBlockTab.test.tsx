import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AdBlockTab from '../components/AdBlockTab';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('AdBlockTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.chrome.storage.sync.get.mockImplementation((keys, callback) =>
      callback({ blockedWebsites: [] })
    );
  });

  it('renders correctly', async () => {
    const { getByText, getByPlaceholderText } = render(<AdBlockTab />);

    await waitFor(() => {
      expect(getByText('adblock.title')).toBeInTheDocument();
      expect(getByText('adblock.description')).toBeInTheDocument();
      expect(getByPlaceholderText('adblock.placeholder')).toBeInTheDocument();
      expect(getByText('adblock.add')).toBeInTheDocument();
    });
  });

  it('adds a website to the block list', async () => {
    const { getByPlaceholderText, getByText } = render(<AdBlockTab />);

    const input = getByPlaceholderText('adblock.placeholder');
    fireEvent.change(input, { target: { value: 'example.com' } });
    
    const addButton = getByText('adblock.add');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(global.chrome.storage.sync.set).toHaveBeenCalledWith({
        blockedWebsites: ['example.com'],
      });
    });
  });

  it('removes a website from the block list', async () => {
    global.chrome.storage.sync.get.mockImplementation((keys, callback) =>
      callback({ blockedWebsites: ['example.com'] })
    );

    const { getByText } = render(<AdBlockTab />);

    await waitFor(() => {
      const removeButton = getByText('adblock.remove');
      fireEvent.click(removeButton);
    });

    await waitFor(() => {
      expect(global.chrome.storage.sync.set).toHaveBeenCalledWith({
        blockedWebsites: [],
      });
    });
  });
});