<script lang="ts">
  import { VerifierForm, type GameEntry } from '$lib';
  import { gameDefinition as crashGameDefinition } from '../demo/games/crash';
  import { gameDefinition as diceGameDefinition } from '../demo/games/dice';
  import { gameDefinition as plinkoGameDefinition } from '../demo/games/plinko';
  import { gameDefinition as slideGameDefinition } from '../demo/games/slide';
  import { gameDefinition as wheelGameDefinition } from '../demo/games/wheel';

  const games: Record<string, GameEntry> = {
    dice: { name: diceGameDefinition.name, loader: () => Promise.resolve(diceGameDefinition) },
    plinko: {
      name: plinkoGameDefinition.name,
      loader: () => Promise.resolve(plinkoGameDefinition),
    },
    slide: { name: slideGameDefinition.name, loader: () => Promise.resolve(slideGameDefinition) },
    crash: { name: crashGameDefinition.name, loader: () => Promise.resolve(crashGameDefinition) },
    wheel: { name: wheelGameDefinition.name, loader: () => Promise.resolve(wheelGameDefinition) },
  };
</script>

<VerifierForm {games} />
