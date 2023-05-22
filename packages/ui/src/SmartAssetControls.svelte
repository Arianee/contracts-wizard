<script lang="ts">
  import HelpTooltip from './HelpTooltip.svelte';

  import type { KindedOptions } from '@openzeppelin/wizard';
  import { smartAsset, infoDefaults } from '@openzeppelin/wizard';

  import SmartAssetUriControls from './SmartAssetUriControls.svelte';
  import InfoSection from './InfoSection.svelte';

  export const opts: Required<KindedOptions['SmartAsset']> = {
    kind: 'SmartAsset',
    ...smartAsset.defaults,
    info: { ...infoDefaults }, // create new object since Info is nested
  };

  $: requireAccessControl = smartAsset.isAccessControlRequired(opts);
</script>

<section class="controls-section">
  <h1>Settings</h1>

    <div class="grid grid-cols-[2fr,1fr] gap-2">
      <label class="labeled-input">
        <span>Name</span>
        <input bind:value={opts.name}>
      </label>

      <label class="labeled-input">
        <span>Symbol</span>
        <input bind:value={opts.symbol}>
      </label>
    </div>

    <div class="grid grid-cols-[1fr]">
      <label class="labeled-input">
        <span>Base URI</span>
        <input bind:value={opts.baseUri} placeholder="https://...">
      </label>
    </div>
</section>

<SmartAssetUriControls bind:uriStorage={opts.uriStorage} />

<section class="controls-section">
  <h1>Features</h1>

  <div class="checkbox-group">
    <label class:checked={opts.updatable}>
      <input type="checkbox" bind:checked={opts.updatable}>
      Updatable
      <HelpTooltip>
        Issuer will be able to update a token imprint after initial hydration.
      </HelpTooltip>
    </label>

    <label class:checked={opts.recoverable}>
      <input type="checkbox" bind:checked={opts.recoverable}>
      Recoverable
      <HelpTooltip>
        Issuer will be able to recover tokens under certain conditions.
      </HelpTooltip>
    </label>

    <label class:checked={opts.burnable}>
      <input type="checkbox" bind:checked={opts.burnable}>
      Burnable
      <HelpTooltip>
        Token holders will be able to destroy their tokens.
      </HelpTooltip>
    </label>

    <label class:checked={opts.soulbound}>
      <input type="checkbox" bind:checked={opts.soulbound}>
      Soulbound
      <HelpTooltip>
        Tokens will be bound to their owner and will not be transferable.
      </HelpTooltip>
    </label>
  </div>
</section>


<!-- <AccessControlSection bind:access={opts.access} required={requireAccessControl} /> -->
<!-- <UpgradeabilitySection bind:upgradeable={opts.upgradeable} /> -->

<InfoSection bind:info={opts.info} />
