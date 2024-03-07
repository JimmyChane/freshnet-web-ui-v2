<script setup lang="ts"></script>

<template>
  <div class="App">
    <div class="App-background" style="z-index: 0"></div>

    <div class="App-body" :style="{ 'z-index': '1' }">
      <router-view
        class="App-routerView"
        :style="{ 'grid-area': 'body' }"
        ref="AppRouterView"
      />
    </div>
  </div>
</template>

<style lang="scss">
  :root {
    font-size: 16px;
  }
  @media (max-width: 320px) {
    :root {
      font-size: 14px;
    }
  }
  *,
  *::before,
  *::after {
    line-height: 1;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    font-family: "Roboto", sans-serif;
    word-break: break-word;
  }
  html {
    overscroll-behavior-x: none;
  }
  body {
    @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
    width: 100dvw;
    height: 100dvh;
    overscroll-behavior-x: none;
    overscroll-behavior-y: none;
  }
  p {
    white-space: pre-line;
  }

  .scrollbar {
    --scrollbar-size: 0;

    --scrollbar-thumb-radius: 0;
    --scrollbar-thumb-color: none;
    --scrollbar-thumb-color-hover: none;

    --scrollbar-track-margin: 0;
    --scrollbar-track-color: none;
    --scrollbar-track-color-hover: none;

    scrollbar-width: var(--scrollbar-size);
    scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
    &::-webkit-scrollbar {
      height: var(--scrollbar-size);
      width: var(--scrollbar-size);
      &-thumb {
        border-radius: var(--scrollbar-thumb-radius);
        background: var(--scrollbar-thumb-color);
        &:hover {
          background: var(--scrollbar-thumb-color-hover);
        }
      }
      &-track {
        margin: var(--scrollbar-track-margin);
        background: var(--scrollbar-track-color);
        &:hover {
          background: var(--scrollbar-track-color-hover);
        }
      }
    }
  }
  .transition {
    --transition-target: all;
    --transition-duration: 200ms;
    --transition-delay: 0;
    --transition-timing: linear;
    transition: var(--transition-target) var(--transition-duration)
      var(--transition-timing);
    transition-delay: var(--transition-delay);
  }

  // color schemas
  .App {
    --primary-color: #294656;
    --accent-color: #fc8237;
    --accent-color-hover: #c45815;
    --statusbar-color: #384a6a;
    --App-background-color: white;
  }
  .App {
    color: black;
    width: 100dvw;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: none;
    overflow-x: hidden;
    overflow: hidden;

    .App-background {
      position: fixed;
      width: 100dvw;
      height: 100dvh;
      opacity: 0.5;
      pointer-events: none;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-image: linear-gradient(
        120deg,
        hsl(202, 61%, 33%) 4%,
        hsl(236, 66%, 24%) 95%
      );
      display: none;
    }
    .App-body {
      width: 100dvw;
      height: 100dvh;

      background: var(--App-background-color);
      --background-color-light: var(--background-color);
      --background-color-dark: var(--background-color);

      display: grid;
      grid-template-areas:
        "left body"
        "bottom bottom";
      grid-template-rows: minmax(100%, 1fr);
      grid-template-columns: max-content 1fr;

      .App-routerView {
        background: #f1f1f1;
      }
    }
  }
</style>
@/stores
