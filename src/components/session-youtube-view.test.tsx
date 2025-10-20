import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { SessionYouTubeView } from './session-youtube-view';
import type { TimestampList } from '@/validations/timestamps';
import type { ReactElement } from 'react';

/**
 * Helper function to render components with MantineProvider
 */
function renderWithMantine(ui: ReactElement) {
    return render(<MantineProvider>{ui}</MantineProvider>);
}

/**
 * Test suite for SessionYouTubeView component
 * Tests the rendering and functionality of YouTube-formatted timestamp display
 */
describe('SessionYouTubeView', () => {
    const mockTimestamps: TimestampList = [
        {
            id: '1',
            sessionId: 'session-1',
            title: 'Introduction',
            createdAt: new Date('2025-01-01T00:00:00Z'),
        },
        {
            id: '2',
            sessionId: 'session-1',
            title: 'Main Topic',
            createdAt: new Date('2025-01-01T00:02:30Z'),
        },
        {
            id: '3',
            sessionId: 'session-1',
            title: 'Conclusion',
            createdAt: new Date('2025-01-01T00:05:45Z'),
        },
    ];

    beforeEach(() => {
        // Mock window.getSelection
        const mockSelection = {
            removeAllRanges: vi.fn(),
            addRange: vi.fn(),
        };
        vi.stubGlobal('getSelection', vi.fn(() => mockSelection));

        // Mock document.createRange
        const mockRange = {
            selectNodeContents: vi.fn(),
        };
        vi.spyOn(document, 'createRange').mockReturnValue(mockRange as unknown as Range);
    });

    describe('rendering', () => {
        it('should render the component with formatted timestamps', () => {
            renderWithMantine(<SessionYouTubeView timestamps={mockTimestamps} />);

            // Check that the formatted text is displayed
            const codeBlock = screen.getByText(/00:00 Introduction/);
            expect(codeBlock).toBeInTheDocument();
            expect(codeBlock).toHaveTextContent('00:00 Introduction');
            expect(codeBlock).toHaveTextContent('02:30 Main Topic');
            expect(codeBlock).toHaveTextContent('05:45 Conclusion');
        });

        it('should render Select Text button when timestamps are provided', () => {
            renderWithMantine(<SessionYouTubeView timestamps={mockTimestamps} />);

            const selectButton = screen.getByRole('button', { name: /select text/i });
            expect(selectButton).toBeInTheDocument();
        });

        it('should not render Select Text button when timestamps are null', () => {
            renderWithMantine(<SessionYouTubeView timestamps={null} />);

            const selectButton = screen.queryByRole('button', { name: /select text/i });
            expect(selectButton).not.toBeInTheDocument();
        });

        it('should not render Select Text button when timestamps are undefined', () => {
            renderWithMantine(<SessionYouTubeView timestamps={undefined} />);

            const selectButton = screen.queryByRole('button', { name: /select text/i });
            expect(selectButton).not.toBeInTheDocument();
        });

        it('should render Select Text button even when timestamps array is empty', () => {
            renderWithMantine(<SessionYouTubeView timestamps={[]} />);

            // The button is shown because formattedTimestampsArray is an empty array (not null)
            const selectButton = screen.queryByRole('button', { name: /select text/i });
            expect(selectButton).toBeInTheDocument();
        });
    });

    describe('timestamp formatting', () => {
        it('should format timestamps relative to the first timestamp', () => {
            renderWithMantine(<SessionYouTubeView timestamps={mockTimestamps} />);

            const codeBlock = screen.getByText(/00:00 Introduction/);
            expect(codeBlock).toHaveTextContent('00:00 Introduction');
            expect(codeBlock).toHaveTextContent('02:30 Main Topic');
            expect(codeBlock).toHaveTextContent('05:45 Conclusion');
        });

        it('should handle timestamps without titles', () => {
            const timestampsWithoutTitles: TimestampList = [
                {
                    id: '1',
                    sessionId: 'session-1',
                    title: null,
                    createdAt: new Date('2025-01-01T00:00:00Z'),
                },
                {
                    id: '2',
                    sessionId: 'session-1',
                    title: null,
                    createdAt: new Date('2025-01-01T00:01:15Z'),
                },
            ];

            renderWithMantine(<SessionYouTubeView timestamps={timestampsWithoutTitles} />);

            const codeBlock = screen.getByText(/00:00/);
            expect(codeBlock).toHaveTextContent('00:00');
            expect(codeBlock).toHaveTextContent('01:15');
        });

        it('should format timestamps longer than an hour', () => {
            const longTimestamps: TimestampList = [
                {
                    id: '1',
                    sessionId: 'session-1',
                    title: 'Start',
                    createdAt: new Date('2025-01-01T00:00:00Z'),
                },
                {
                    id: '2',
                    sessionId: 'session-1',
                    title: 'After 1 hour',
                    createdAt: new Date('2025-01-01T01:05:30Z'),
                },
            ];

            renderWithMantine(<SessionYouTubeView timestamps={longTimestamps} />);

            // The formatTimeDuration function uses hh:mm:ss format when duration is >= 1 hour
            const codeBlock = screen.getByText(/00:00 Start/);
            expect(codeBlock).toHaveTextContent('00:00 Start');
            expect(codeBlock).toHaveTextContent('01:05:30 After 1 hour');
        });
    });

    describe('Select Text button functionality', () => {
        it('should call window.getSelection when Select Text button is clicked', async () => {
            const user = userEvent.setup();
            renderWithMantine(<SessionYouTubeView timestamps={mockTimestamps} />);

            const selectButton = screen.getByRole('button', { name: /select text/i });
            await user.click(selectButton);

            expect(window.getSelection).toHaveBeenCalled();
        });

        it('should select the code block contents when Select Text button is clicked', async () => {
            const user = userEvent.setup();
            renderWithMantine(<SessionYouTubeView timestamps={mockTimestamps} />);

            const selectButton = screen.getByRole('button', { name: /select text/i });
            await user.click(selectButton);

            const selection = window.getSelection();
            const range = document.createRange();

            expect(selection?.removeAllRanges).toHaveBeenCalled();
            expect(range.selectNodeContents).toHaveBeenCalled();
            expect(selection?.addRange).toHaveBeenCalledWith(range);
        });

        it('should handle null selection gracefully', async () => {
            // Mock getSelection to return null
            vi.stubGlobal('getSelection', vi.fn(() => null));

            const user = userEvent.setup();
            renderWithMantine(<SessionYouTubeView timestamps={mockTimestamps} />);

            const selectButton = screen.getByRole('button', { name: /select text/i });

            // Should not throw an error
            await expect(user.click(selectButton)).resolves.not.toThrow();
        });
    });

    describe('edge cases', () => {
        it('should handle single timestamp', () => {
            const singleTimestamp: TimestampList = [
                {
                    id: '1',
                    sessionId: 'session-1',
                    title: 'Only One',
                    createdAt: new Date('2025-01-01T00:00:00Z'),
                },
            ];

            renderWithMantine(<SessionYouTubeView timestamps={singleTimestamp} />);

            const codeBlock = screen.getByText(/00:00 Only One/);
            expect(codeBlock).toBeInTheDocument();
        });

        it('should render empty code block when timestamps is null', () => {
            const { container } = renderWithMantine(<SessionYouTubeView timestamps={null} />);

            // Mantine Code component renders a pre element
            const preElement = container.querySelector('pre');
            expect(preElement).toBeInTheDocument();
            expect(preElement).toHaveTextContent('');
        });

        it('should render empty code block when timestamps is undefined', () => {
            const { container } = renderWithMantine(<SessionYouTubeView timestamps={undefined} />);

            // Mantine Code component renders a pre element
            const preElement = container.querySelector('pre');
            expect(preElement).toBeInTheDocument();
            expect(preElement).toHaveTextContent('');
        });
    });
});
