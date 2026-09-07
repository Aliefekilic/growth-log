import { render, screen, waitFor } from '@testing-library/react';
import { TechTagInput } from './TechTagInput';
import { describe, it, expect, vi } from 'vitest';

// technologyApi.getAll() mock — API çağrısı test ortamında hata vermesin
vi.mock('../api/projectApi', () => ({
  technologyApi: {
    getAll: vi.fn().mockResolvedValue([]),
  },
  projectApi: {},
}));

describe('TechTagInput Component', () => {
  it('renders technology tags correctly', async () => {
    const value = ['React', 'TypeScript', 'C#'];
    const onChange = vi.fn();

    render(<TechTagInput value={value} onChange={onChange} />);

    await waitFor(() => {
      expect(screen.getByText('React')).toBeDefined();
      expect(screen.getByText('TypeScript')).toBeDefined();
      expect(screen.getByText('C#')).toBeDefined();
    });
  });

  it('calls onChange when remove button is clicked', async () => {
    const value = ['React', 'TypeScript'];
    const onChange = vi.fn();

    render(<TechTagInput value={value} onChange={onChange} />);

    const removeBtn = await screen.findByLabelText('React etiketini kaldır');
    removeBtn.click();

    expect(onChange).toHaveBeenCalledWith(['TypeScript']);
  });
});
