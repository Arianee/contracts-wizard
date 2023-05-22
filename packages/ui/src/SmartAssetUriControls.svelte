<script lang="ts">
  import HelpTooltip from './HelpTooltip.svelte';
  import type { UriStorage } from '@openzeppelin/wizard';
  
  export let uriStorage: UriStorage;
</script>

<section class="controls-section">
  <h1>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="flex items-center tooltip-container pr-2">
      <span>Uri Storage</span>
      <HelpTooltip align="right">
        Define how the metadata URI of each token can be configured.
      </HelpTooltip>
    </label>
  </h1>

  <div class="checkbox-group">
    <label class:checked={uriStorage === 'baseURI'}>
      <input type="radio" bind:group={uriStorage} value="baseURI">
      Base URI
      <HelpTooltip>
        Simple mechanism where a single base URI is set for all tokens. The URI of each token is computed by concatenating the base URI with the token ID. (e.g. https://example.com/1)
      </HelpTooltip>
    </label>
    <label class:checked={uriStorage === 'overridableBaseURI'}>
      <input type="radio" bind:group={uriStorage} value="overridableBaseURI">
      Overridable Base URI
      <HelpTooltip>
        Flexible mechanism where the URI of each token can be set individually. (e.g. https://abc.com/1.json,  https://def.com/2.json).
        It is an extension of the "Base URI" mechanism, if no custom URI has been set for a token, the "Base URI" behavior is used.
      </HelpTooltip>
    </label>
  </div>
</section>

