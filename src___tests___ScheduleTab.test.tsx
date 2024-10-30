import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ScheduleTab from '../components/ScheduleTab';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ScheduleTab', () => {
  const mockOnGenerateSchedule = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.chrome.storage.sync.get.mockImplementation((keys, callback) =>
      callback({ schedule: [] })
    );
  });

  it('renders correctly', async () => {
    const { getByText } = render(<ScheduleTab onGenerateSchedule={mockOnGenerateSchedule} />);

    await waitFor(() => {
      expect(getByText('schedule.title')).toBeInTheDocument();
      expect(getByText('schedule.generate')).toBeInTheDocument();
    });
  });

  it('calls onGenerateSchedule when button is clicked', async () => {
    const { getByText } = render(<ScheduleTab onGenerateSchedule={mockOnGenerateSchedule} />);

    const generateButton = getByText('schedule.generate');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockOnGenerateSchedule).toHaveBeenCalledTimes(1);
    });
  });

  it('displays the current schedule', async () => {
    const mockSchedule = [
      { time: '09:00', task: 'Study Math' },
      { time: '11:00', task: 'Break' },
    ];

    global.chrome.storage.sync.get.mockImplementation((keys, callback) =>
      callback({ schedule: mockSchedule })
    );

    const { getByText } = render(<ScheduleTab onGenerateSchedule={mockOnGenerateSchedule} />);

    await waitFor(() => {
      expect(getByText('schedule.currentSchedule')).toBeInTheDocument();
      expect(getByText('09:00: Study Math')).toBeInTheDocument();
      expect(getByText('11:00: Break')).toBeInTheDocument();
    });
  });
});