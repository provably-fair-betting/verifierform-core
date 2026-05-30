import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { tick } from 'svelte';
import GamePicker from '$lib/verifier/GamePicker.svelte';
import type { GameEntry } from '$lib/verifier/types';

function makeGames(withImages = false): Record<string, GameEntry> {
  return {
    dice: { name: 'Dice', loader: vi.fn(), ...(withImages ? { image: 'dice.png' } : {}) },
    plinko: { name: 'Plinko', loader: vi.fn(), ...(withImages ? { image: 'plinko.png' } : {}) },
    wheel: { name: 'Wheel', loader: vi.fn(), ...(withImages ? { image: 'wheel.png' } : {}) },
  };
}

describe('GamePicker', () => {
  test('renders trigger with selected game name', () => {
    render(GamePicker, { props: { games: makeGames(), selectedGame: 'dice', onselect: vi.fn() } });
    expect(screen.getByRole('button', { name: /select game: dice/i })).toBeInTheDocument();
  });

  test('opens and closes on trigger click', async () => {
    const user = userEvent.setup();
    render(GamePicker, { props: { games: makeGames(), selectedGame: 'dice', onselect: vi.fn() } });

    expect(screen.queryByLabelText('Search games')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /select game/i }));
    expect(screen.getByLabelText('Search games')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /select game/i }));
    expect(screen.queryByLabelText('Search games')).not.toBeInTheDocument();
  });

  test('picking a game calls onselect and closes the picker', async () => {
    const user = userEvent.setup();
    const onselect = vi.fn();
    render(GamePicker, { props: { games: makeGames(), selectedGame: 'dice', onselect } });

    await user.click(screen.getByRole('button', { name: /select game/i }));
    await user.click(screen.getByRole('button', { name: /^plinko$/i }));

    expect(onselect).toHaveBeenCalledWith('plinko');
    expect(screen.queryByLabelText('Search games')).not.toBeInTheDocument();
  });

  test('Escape key closes the picker', async () => {
    const user = userEvent.setup();
    render(GamePicker, { props: { games: makeGames(), selectedGame: 'dice', onselect: vi.fn() } });

    await user.click(screen.getByRole('button', { name: /select game/i }));
    expect(screen.getByLabelText('Search games')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    await tick();

    expect(screen.queryByLabelText('Search games')).not.toBeInTheDocument();
  });

  test('non-Escape key does not close the picker', async () => {
    const user = userEvent.setup();
    render(GamePicker, { props: { games: makeGames(), selectedGame: 'dice', onselect: vi.fn() } });

    await user.click(screen.getByRole('button', { name: /select game/i }));
    expect(screen.getByLabelText('Search games')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Tab' });
    await tick();

    expect(screen.getByLabelText('Search games')).toBeInTheDocument();
  });

  test('clicking outside closes the picker', async () => {
    const user = userEvent.setup();
    render(GamePicker, { props: { games: makeGames(), selectedGame: 'dice', onselect: vi.fn() } });

    await user.click(screen.getByRole('button', { name: /select game/i }));
    expect(screen.getByLabelText('Search games')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    await tick();

    expect(screen.queryByLabelText('Search games')).not.toBeInTheDocument();
  });

  test('searching filters the game list', async () => {
    const user = userEvent.setup();
    render(GamePicker, { props: { games: makeGames(), selectedGame: 'dice', onselect: vi.fn() } });

    await user.click(screen.getByRole('button', { name: /select game/i }));
    await user.type(screen.getByLabelText('Search games'), 'plinko');

    expect(screen.getByRole('button', { name: /^plinko$/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^dice$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^wheel$/i })).not.toBeInTheDocument();
  });

  test('empty search result shows "No games found."', async () => {
    const user = userEvent.setup();
    render(GamePicker, { props: { games: makeGames(), selectedGame: 'dice', onselect: vi.fn() } });

    await user.click(screen.getByRole('button', { name: /select game/i }));
    await user.type(screen.getByLabelText('Search games'), 'zzz');

    expect(screen.getByText('No games found.')).toBeInTheDocument();
  });

  test('selected game appears first in the grid', async () => {
    const user = userEvent.setup();
    render(GamePicker, {
      props: { games: makeGames(), selectedGame: 'plinko', onselect: vi.fn() },
    });

    await user.click(screen.getByRole('button', { name: /select game/i }));

    const gameButtons = screen.getAllByRole('button', { name: /^(dice|plinko|wheel)$/i });
    expect(gameButtons[0]).toHaveAccessibleName('Plinko');
  });

  test('renders selected game image in trigger when entry has an image', () => {
    render(GamePicker, {
      props: { games: makeGames(true), selectedGame: 'dice', onselect: vi.fn() },
    });

    expect(screen.getByAltText('Dice')).toBeInTheDocument();
  });

  test('renders game images in grid when entries have images', async () => {
    const user = userEvent.setup();
    render(GamePicker, {
      props: { games: makeGames(true), selectedGame: 'dice', onselect: vi.fn() },
    });

    await user.click(screen.getByRole('button', { name: /select game/i }));

    // trigger (Dice) + grid (Dice, Plinko, Wheel)
    expect(screen.getAllByRole('img')).toHaveLength(4);
    expect(screen.getByAltText('Plinko')).toBeInTheDocument();
    expect(screen.getByAltText('Wheel')).toBeInTheDocument();
  });
});
