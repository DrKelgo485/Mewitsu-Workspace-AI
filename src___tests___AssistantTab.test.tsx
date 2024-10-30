import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AssistantTab from '../components/AssistantTab';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('AssistantTab', () => {
  const mockOnSend = jest.fn();
  const mockHandleChatGPTResponse = jest.fn();
  const mockSetIsLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <AssistantTab
        isPremium={false}
        onSend={mockOnSend}
        handleChatGPTResponse={mockHandleChatGPTResponse}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
      />
    );

    expect(getByText('assistant.title')).toBeInTheDocument();
    expect(getByPlaceholderText('assistant.placeholder')).toBeInTheDocument();
    expect(getByText('assistant.help')).toBeInTheDocument();
  });

  it('handles query input and submission', async () => {
    const { getByPlaceholderText, getByText } = render(
      <AssistantTab
        isPremium={false}
        onSend={mockOnSend}
        handleChatGPTResponse={mockHandleChatGPTResponse}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
      />
    );

    const input = getByPlaceholderText('assistant.placeholder');
    fireEvent.change(input, { target: { value: 'Test query' } });
    expect(input).toHaveValue('Test query');

    mockHandleChatGPTResponse.mockResolvedValue('AI response');

    const sendButton = getByText('assistant.help');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockHandleChatGPTResponse).toHaveBeenCalledWith('Test query');
      expect(mockOnSend).toHaveBeenCalledWith('AI response');
    });
  });

  it('displays loading state', () => {
    const { getByText } = render(
      <AssistantTab
        isPremium={false}
        onSend={mockOnSend}
        handleChatGPTResponse={mockHandleChatGPTResponse}
        isLoading={true}
        setIsLoading={mockSetIsLoading}
      />
    );

    expect(getByText('assistant.thinking')).toBeInTheDocument();
  });

  it('displays premium message for non-premium users', () => {
    const { getByText } = render(
      <AssistantTab
        isPremium={false}
        onSend={mockOnSend}
        handleChatGPTResponse={mockHandleChatGPTResponse}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
      />
    );

    expect(getByText('assistant.upgrade')).toBeInTheDocument();
  });

  it('does not display premium message for premium users', () => {
    const { queryByText } = render(
      <AssistantTab
        isPremium={true}
        onSend={mockOnSend}
        handleChatGPTResponse={mockHandleChatGPTResponse}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
      />
    );

    expect(queryByText('assistant.upgrade')).not.toBeInTheDocument();
  });
});