<script lang="ts">
    export let className = ''
    export let onreload
    export let onshutdown
</script>

<header class="header {className}">
    <h1>PI Chamber</h1>
    <div class="buttons">
        <button class="button" onclick={onreload}>↻</button>
        <button class="button" onclick={onshutdown}>⏼</button>
    </div>
</header>

<style>
    .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background-color: #2c3e50;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }
</style>
